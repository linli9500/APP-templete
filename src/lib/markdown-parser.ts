/**
 * Markdown 解析工具
 * 从报告内容中提取标题、关键词和简介
 */

// 报告摘要接口
export interface ReportSummary {
  title: string;        // 第一个标题
  keywords: string[];   // 关键词列表（从 H2 标题提取）
  highlight: string;    // 简介文字
}

/**
 * 从 Markdown 内容中提取报告摘要
 * @param markdown Markdown 格式的报告内容
 * @returns 包含标题、关键词和简介的摘要对象
 */
export function extractReportSummary(markdown: string): ReportSummary {
  const lines = markdown.split('\n');
  
  let title = '';
  const keywords: string[] = [];
  let highlight = '';
  
  // 用于收集段落文本
  let paragraphText = '';
  let foundFirstParagraph = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 提取第一个标题（H1 或 H2）
    if (!title) {
      const h1Match = trimmedLine.match(/^#\s+(.+)$/);
      const h2Match = trimmedLine.match(/^##\s+(.+)$/);
      if (h1Match) {
        title = h1Match[1].trim();
        continue;
      } else if (h2Match && !title) {
        title = h2Match[1].trim();
        continue;
      }
    }
    
    // 提取所有 H2 标题作为关键词（最多 5 个）
    const h2Match = trimmedLine.match(/^##\s+(.+)$/);
    if (h2Match && keywords.length < 5) {
      const keyword = h2Match[1].trim();
      // 避免重复添加作为标题的内容
      if (keyword !== title && !keywords.includes(keyword)) {
        keywords.push(keyword);
      }
      continue;
    }
    
    // 提取第一段非空文本作为简介
    if (!foundFirstParagraph && trimmedLine && !trimmedLine.startsWith('#')) {
      // 跳过列表项和代码块标记
      if (!trimmedLine.startsWith('-') && 
          !trimmedLine.startsWith('*') && 
          !trimmedLine.startsWith('```') &&
          !trimmedLine.startsWith('>')) {
        paragraphText += trimmedLine + ' ';
        // 如果遇到空行或收集了足够的文本，结束收集
        if (paragraphText.length >= 100) {
          foundFirstParagraph = true;
        }
      }
    } else if (paragraphText && !trimmedLine) {
      // 遇到空行，结束段落收集
      foundFirstParagraph = true;
    }
  }
  
  // 处理简介文本
  highlight = paragraphText.trim();
  if (highlight.length > 120) {
    // 截取前 120 字符并添加省略号
    highlight = highlight.substring(0, 117) + '...';
  }
  
  // 如果没有找到 H2 关键词，尝试从加粗文本中提取
  if (keywords.length === 0) {
    const boldMatches = markdown.match(/\*\*([^*]+)\*\*/g);
    if (boldMatches) {
      for (const match of boldMatches.slice(0, 5)) {
        const keyword = match.replace(/\*\*/g, '').trim();
        if (keyword.length < 20 && !keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      }
    }
  }
  
  // 默认值
  if (!title) {
    title = 'Your Energy Analysis';
  }
  if (keywords.length === 0) {
    keywords.push('Energy', 'Balance', 'Insight');
  }
  if (!highlight) {
    highlight = 'Discover your unique energy patterns and unlock your potential.';
  }
  
  return {
    title,
    keywords,
    highlight,
  };
}
