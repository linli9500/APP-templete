import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 城市数据结构（精简版）
 */
interface CityData {
  city: string;    // 城市名
  state: string;   // 州/省
  country: string; // 国家
}

/**
 * 城市搜索结果接口
 */
export interface CityResult {
  name: string;           // 城市名称
  state: string;          // 州/省名称
  country: string;        // 国家名称
  displayName: string;    // 显示名称（城市, 州, 国家）
}

// 懒加载城市数据缓存
let citiesCache: CityData[] | null = null;
let loadingPromise: Promise<CityData[]> | null = null;

/**
 * 预加载城市数据
 * 在页面加载时调用，用户填写其他信息时后台加载
 * 这样用户到城市输入框时数据已准备好
 */
export const preloadCitiesData = (): void => {
  // 如果已加载或正在加载，跳过
  if (citiesCache || loadingPromise) return;

  console.log('[CitySearch] 开始预加载城市数据...');
  loadCitiesData();
};

/**
 * 懒加载城市数据
 * 只在第一次使用时加载，后续使用缓存
 */
const loadCitiesData = async (): Promise<CityData[]> => {
  // 如果已缓存，直接返回
  if (citiesCache) {
    return citiesCache;
  }

  // 如果正在加载中，等待加载完成
  if (loadingPromise) {
    return loadingPromise;
  }

  // 开始加载
  loadingPromise = import('@/data/cities-lite.json')
    .then((module) => {
      citiesCache = module.default as CityData[];
      console.log(`[CitySearch] 城市数据已加载: ${citiesCache.length} 个城市`);
      return citiesCache;
    })
    .catch((error) => {
      console.error('[CitySearch] 加载城市数据失败:', error);
      loadingPromise = null;
      return [];
    });

  return loadingPromise;
};

/**
 * 在离线数据中搜索城市
 * 支持模糊匹配城市名、州名和国家名
 * 例如输入 "los" 会匹配 "Los Angeles", "Los Alamos" 等
 */
const searchCitiesOffline = (
  cities: CityData[],
  query: string,
  limit: number = 10
): CityResult[] => {
  if (!query || query.length < 2 || cities.length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();
  const results: CityResult[] = [];

  // 遍历城市数据进行匹配
  for (const city of cities) {
    // 匹配城市名（优先）
    const cityMatch = city.city.toLowerCase().includes(lowerQuery);
    // 匹配州名
    const stateMatch = city.state.toLowerCase().includes(lowerQuery);
    // 匹配国家名
    const countryMatch = city.country.toLowerCase().includes(lowerQuery);

    if (cityMatch || stateMatch || countryMatch) {
      results.push({
        name: city.city,
        state: city.state,
        country: city.country,
        displayName: `${city.city}, ${city.state}, ${city.country}`,
      });

      // 限制结果数量
      if (results.length >= limit) break;
    }
  }

  // 按城市名匹配优先级排序（以查询开头的优先）
  results.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(lowerQuery);
    const bStartsWith = b.name.toLowerCase().startsWith(lowerQuery);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.name.localeCompare(b.name);
  });

  return results;
};

/**
 * 城市搜索 Hook
 * 使用懒加载的离线数据进行本地搜索
 * 
 * 使用方式：
 * 1. 在页面组件中调用 preloadCitiesData() 预加载数据
 * 2. 用户输入时使用 search() 搜索
 * 
 * 示例：
 * ```tsx
 * useEffect(() => {
 *   preloadCitiesData(); // 页面加载时预加载
 * }, []);
 * ```
 */
export const useCitySearch = (debounceMs: number = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 数据加载中
  
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 组件挂载时检查数据是否已加载
  useEffect(() => {
    // 如果数据未加载，自动预加载
    if (!citiesCache && !loadingPromise) {
      preloadCitiesData();
    }
  }, []);

  // 防抖搜索
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 如果查询太短，清空结果
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsLoading(false);
      return;
    }

    setIsSearching(true);

    // 设置防抖定时器
    debounceTimerRef.current = setTimeout(async () => {
      // 检查是否需要加载数据
      if (!citiesCache) {
        setIsLoading(true);
      }
      
      try {
        const cities = await loadCitiesData();
        const searchResults = searchCitiesOffline(cities, searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('[CitySearch] 搜索失败:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
        setIsLoading(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  // 清空搜索
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    setIsLoading(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    query,
    results,
    isSearching,
    isLoading, // 首次加载数据时为 true
    search,
    clearSearch,
    // 检查数据是否已加载
    isDataLoaded: !!citiesCache,
  };
};

export default useCitySearch;
