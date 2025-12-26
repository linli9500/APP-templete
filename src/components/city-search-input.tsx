import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/components/ui';
import { useCitySearch, CityResult } from '@/hooks/useCitySearch';
import { translate } from '@/lib';

interface CitySearchInputProps {
  value: string;
  onSelect: (city: CityResult) => void;
  placeholder?: string;
}

/**
 * 城市搜索输入组件
 * 使用懒加载的离线城市数据库
 * - 首次搜索时加载数据（约 1-2 秒显示加载中）
 * - 后续搜索秒响应
 */
export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  onSelect,
  placeholder,
}) => {
  const { colorScheme } = useColorScheme();
  const { results, isSearching, isLoading, search, clearSearch } = useCitySearch(300);
  
  const [inputValue, setInputValue] = useState(value);
  const [showResults, setShowResults] = useState(false);

  const handleChangeText = (text: string) => {
    setInputValue(text);
    setShowResults(true);
    search(text);
  };

  const handleSelect = (city: CityResult) => {
    setInputValue(city.displayName);
    setShowResults(false);
    clearSearch();
    onSelect(city);
  };

  const handleBlur = () => {
    // 延迟关闭以允许点击选项
    setTimeout(() => setShowResults(false), 200);
  };

  const renderItem = ({ item }: { item: CityResult }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700"
      activeOpacity={0.7}
    >
      <Text className="text-black dark:text-white font-medium">
        {item.name}
      </Text>
      <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
        {item.state}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  // 是否正在加载（首次加载数据或搜索中）
  const showLoadingIndicator = isSearching || isLoading;

  return (
    <View className="relative">
      {/* 输入框 */}
      <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-700 rounded-xl">
        <TextInput
          className="flex-1 px-4 py-3 text-black dark:text-white"
          value={inputValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
        />
        {showLoadingIndicator && (
          <ActivityIndicator 
            size="small" 
            color={colorScheme === 'dark' ? '#fff' : '#000'} 
            style={{ marginRight: 12 }}
          />
        )}
      </View>

      {/* 搜索结果下拉列表 */}
      {showResults && (
        <View 
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-xl shadow-lg z-50"
          style={{ maxHeight: 200 }}
        >
          {/* 首次加载提示 */}
          {isLoading && (
            <View className="px-4 py-3 items-center">
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
                {translate('city_search.loading')}
              </Text>
            </View>
          )}

          {/* 搜索结果 */}
          {!isLoading && results.length > 0 && (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.name}-${item.state}-${item.country}-${index}`}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          )}

          {/* 无结果提示 */}
          {!isLoading && !isSearching && results.length === 0 && inputValue.length >= 2 && (
            <View className="px-4 py-3 items-center">
              <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
                {translate('city_search.no_results')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CitySearchInput;
