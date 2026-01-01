import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FocusAwareStatusBar, Text } from '@/components/ui';
import { translate } from '@/lib';

export default function Mood() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />
      
      {/* Header */}
      <View className="px-6 pt-2 pb-6">
         <Text className="text-3xl font-bold text-black dark:text-white mb-1 font-serif">
           {translate('mood.title')}
         </Text>
         <Text className="text-base text-neutral-500 dark:text-neutral-400 font-medium">
           {translate('mood.mood_desc')}
         </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
            {/* 1. Resentment (Red/Fire) */}
            <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm active:opacity-95 bg-[#FFF0EE] dark:bg-[#4A2020]">
                {/* Visuals */}
                <View className="absolute right-0 top-0 bottom-0 w-32 bg-red-400/20 blur-2xl rounded-full translate-x-10" />
                <View className="absolute left-10 bottom-0 w-20 h-20 bg-orange-400/20 blur-xl rounded-full" />
                
                <View className="p-6 flex-1 justify-between">
                   <View>
                      <View className="flex-row items-center space-x-2 mb-2">
                          <View className="w-2 h-6 bg-red-500 rounded-full" />
                          <Text className="text-sm font-bold text-red-800 dark:text-red-200 uppercase tracking-widest">{translate('mood.resentment_title')}</Text>
                      </View>
                      <Text className="text-xl font-serif text-red-950 dark:text-red-100 italic leading-relaxed pr-8">
                         {translate('mood.resentment_desc')}
                      </Text>
                   </View>
                   <View className="flex-row justify-between items-end">
                       <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                          <Text className="text-xs font-bold text-red-900 dark:text-red-100">{translate('mood.start_analysis')}</Text>
                       </View>
                       <Text className="text-4xl">🔥</Text>
                   </View>
                </View>
            </TouchableOpacity>

            {/* 2. Lonely (Blue/Water) */}
            <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm active:opacity-95 bg-[#F0F7FF] dark:bg-[#1E293B]">
                <View className="absolute left-0 -top-10 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full" />
                <View className="absolute right-10 bottom-10 w-24 h-24 bg-indigo-300/20 blur-xl rounded-full" />
                
                <View className="p-6 flex-1 justify-between">
                   <View>
                      <View className="flex-row items-center space-x-2 mb-2">
                          <View className="w-2 h-6 bg-blue-500 rounded-full" />
                          <Text className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase tracking-widest">{translate('mood.lonely_title')}</Text>
                      </View>
                      <Text className="text-xl font-serif text-blue-950 dark:text-blue-100 italic leading-relaxed pr-8">
                         {translate('mood.lonely_desc')}
                      </Text>
                   </View>
                   <View className="flex-row justify-between items-end">
                       <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                          <Text className="text-xs font-bold text-blue-900 dark:text-blue-100">{translate('mood.start_analysis')}</Text>
                       </View>
                       <Text className="text-4xl">🌊</Text>
                   </View>
                </View>
            </TouchableOpacity>

            {/* 3. Anxiety (Cyan/Wind) */}
            <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm active:opacity-95 bg-[#F0FDFA] dark:bg-[#134E4A]">
                <View className="absolute right-0 top-0 w-48 h-48 bg-teal-300/20 blur-3xl rounded-full" />
                
                <View className="p-6 flex-1 justify-between">
                   <View>
                      <View className="flex-row items-center space-x-2 mb-2">
                          <View className="w-2 h-6 bg-teal-500 rounded-full" />
                          <Text className="text-sm font-bold text-teal-800 dark:text-teal-200 uppercase tracking-widest">{translate('mood.anxiety_title')}</Text>
                      </View>
                      <Text className="text-xl font-serif text-teal-950 dark:text-teal-100 italic leading-relaxed pr-8">
                         {translate('mood.anxiety_desc')}
                      </Text>
                   </View>
                   <View className="flex-row justify-between items-end">
                       <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                          <Text className="text-xs font-bold text-teal-900 dark:text-teal-100">{translate('mood.start_analysis')}</Text>
                       </View>
                       <Text className="text-4xl">🌬️</Text>
                   </View>
                </View>
            </TouchableOpacity>

            {/* 4. Paralysis (Purple/Stagnation) */}
            <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm active:opacity-95 bg-[#FAF5FF] dark:bg-[#3B0764]">
                <View className="absolute left-1/2 top-1/2 -translate-x-16 -translate-y-16 w-32 h-32 bg-purple-400/20 blur-2xl rounded-full" />
                
                <View className="p-6 flex-1 justify-between">
                   <View>
                      <View className="flex-row items-center space-x-2 mb-2">
                          <View className="w-2 h-6 bg-purple-500 rounded-full" />
                          <Text className="text-sm font-bold text-purple-800 dark:text-purple-200 uppercase tracking-widest">{translate('mood.paralysis_title')}</Text>
                      </View>
                      <Text className="text-xl font-serif text-purple-950 dark:text-purple-100 italic leading-relaxed pr-8">
                         {translate('mood.paralysis_desc')}
                      </Text>
                   </View>
                   <View className="flex-row justify-between items-end">
                       <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                          <Text className="text-xs font-bold text-purple-900 dark:text-purple-100">{translate('mood.start_analysis')}</Text>
                       </View>
                       <Text className="text-4xl">🗿</Text>
                   </View>
                </View>
            </TouchableOpacity>

             {/* 5. Burnout (Grey/Depletion) */}
             <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm active:opacity-95 bg-[#F5F5F4] dark:bg-[#1C1917]">
                <View className="absolute bottom-0 right-0 w-64 h-32 bg-stone-400/10 blur-2xl rounded-t-full" />
                
                <View className="p-6 flex-1 justify-between">
                   <View>
                      <View className="flex-row items-center space-x-2 mb-2">
                          <View className="w-2 h-6 bg-stone-500 rounded-full" />
                          <Text className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest">{translate('mood.burnout_title')}</Text>
                      </View>
                      <Text className="text-xl font-serif text-stone-950 dark:text-stone-100 italic leading-relaxed pr-8">
                         {translate('mood.burnout_desc')}
                      </Text>
                   </View>
                   <View className="flex-row justify-between items-end">
                       <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                          <Text className="text-xs font-bold text-stone-900 dark:text-stone-100">{translate('mood.start_analysis')}</Text>
                       </View>
                       <Text className="text-4xl">🔋</Text>
                   </View>
                </View>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}
