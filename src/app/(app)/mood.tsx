import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FocusAwareStatusBar, Text } from '@/components/ui';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { AnimatedGlow } from '@/components/ui/AnimatedGlow';
import { Fire, Wave, Wind, Stone, Battery } from '@/components/ui/icons';
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
            <AnimatedCard delay={0}>
              <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm bg-[#FFF0EE] dark:bg-[#4A2020]">
                  {/* 动态光晕 */}
                  <AnimatedGlow 
                    color="fire" 
                    size="medium" 
                    position={{ right: 0, top: 0 }}
                  />
                  <AnimatedGlow 
                    color="fire" 
                    size="small" 
                    breathDuration={5000}
                    position={{ left: 40, bottom: 0 }}
                  />
                  
                  <View className="p-6 flex-1 justify-between">
                     <View className="z-10">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <View className="w-2 h-6 bg-red-500 rounded-full" />
                            <Text className="text-sm font-bold text-red-800 dark:text-red-200 uppercase tracking-widest">{translate('mood.resentment_title')}</Text>
                        </View>
                        <Text className="text-xl font-serif text-red-950 dark:text-red-100 italic leading-relaxed pr-8">
                           {translate('mood.resentment_desc')}
                        </Text>
                     </View>
                     <View className="flex-row justify-between items-end z-10">
                         <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                            <Text className="text-xs font-bold text-red-900 dark:text-red-100">{translate('mood.start_analysis')}</Text>
                         </View>
                         <Fire color="#7f1d1d" width={36} height={36} />
                     </View>
                  </View>
              </TouchableOpacity>
            </AnimatedCard>

            {/* 2. Lonely (Blue/Water) */}
            <AnimatedCard delay={100}>
              <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm bg-[#F0F7FF] dark:bg-[#1E293B]">
                  <AnimatedGlow 
                    color="water" 
                    size="large" 
                    position={{ left: -40, top: -40 }}
                  />
                  <AnimatedGlow 
                    color="water" 
                    size="small" 
                    breathDuration={5000}
                    position={{ right: 40, bottom: 40 }}
                  />
                  
                  <View className="p-6 flex-1 justify-between">
                     <View className="z-10">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <View className="w-2 h-6 bg-blue-500 rounded-full" />
                            <Text className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase tracking-widest">{translate('mood.lonely_title')}</Text>
                        </View>
                        <Text className="text-xl font-serif text-blue-950 dark:text-blue-100 italic leading-relaxed pr-8">
                           {translate('mood.lonely_desc')}
                        </Text>
                     </View>
                     <View className="flex-row justify-between items-end z-10">
                         <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                            <Text className="text-xs font-bold text-blue-900 dark:text-blue-100">{translate('mood.start_analysis')}</Text>
                         </View>
                         <Wave color="#1e3a5f" width={36} height={36} />
                     </View>
                  </View>
              </TouchableOpacity>
            </AnimatedCard>

            {/* 3. Anxiety (Cyan/Wind) */}
            <AnimatedCard delay={200}>
              <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm bg-[#F0FDFA] dark:bg-[#134E4A]">
                  <AnimatedGlow 
                    color="wind" 
                    size="large" 
                    position={{ right: 0, top: 0 }}
                  />
                  
                  <View className="p-6 flex-1 justify-between">
                     <View className="z-10">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <View className="w-2 h-6 bg-teal-500 rounded-full" />
                            <Text className="text-sm font-bold text-teal-800 dark:text-teal-200 uppercase tracking-widest">{translate('mood.anxiety_title')}</Text>
                        </View>
                        <Text className="text-xl font-serif text-teal-950 dark:text-teal-100 italic leading-relaxed pr-8">
                           {translate('mood.anxiety_desc')}
                        </Text>
                     </View>
                     <View className="flex-row justify-between items-end z-10">
                         <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                            <Text className="text-xs font-bold text-teal-900 dark:text-teal-100">{translate('mood.start_analysis')}</Text>
                         </View>
                         <Wind color="#134e4a" width={36} height={36} />
                     </View>
                  </View>
              </TouchableOpacity>
            </AnimatedCard>

            {/* 4. Paralysis (Purple/Stagnation) */}
            <AnimatedCard delay={300}>
              <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm bg-[#FAF5FF] dark:bg-[#3B0764]">
                  <AnimatedGlow 
                    color="earth" 
                    size="medium" 
                    position={{ left: '40%', top: '40%' }}
                  />
                  
                  <View className="p-6 flex-1 justify-between">
                     <View className="z-10">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <View className="w-2 h-6 bg-purple-500 rounded-full" />
                            <Text className="text-sm font-bold text-purple-800 dark:text-purple-200 uppercase tracking-widest">{translate('mood.paralysis_title')}</Text>
                        </View>
                        <Text className="text-xl font-serif text-purple-950 dark:text-purple-100 italic leading-relaxed pr-8">
                           {translate('mood.paralysis_desc')}
                        </Text>
                     </View>
                     <View className="flex-row justify-between items-end z-10">
                         <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                            <Text className="text-xs font-bold text-purple-900 dark:text-purple-100">{translate('mood.start_analysis')}</Text>
                         </View>
                         <Stone color="#581c87" width={36} height={36} />
                     </View>
                  </View>
              </TouchableOpacity>
            </AnimatedCard>

             {/* 5. Burnout (Grey/Depletion) */}
             <AnimatedCard delay={400}>
               <TouchableOpacity className="w-full h-48 rounded-[32px] overflow-hidden shadow-sm bg-[#F5F5F4] dark:bg-[#1C1917]">
                  <AnimatedGlow 
                    color="metal" 
                    size="large" 
                    position={{ bottom: 0, right: 0 }}
                  />
                  
                  <View className="p-6 flex-1 justify-between">
                     <View className="z-10">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <View className="w-2 h-6 bg-stone-500 rounded-full" />
                            <Text className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest">{translate('mood.burnout_title')}</Text>
                        </View>
                        <Text className="text-xl font-serif text-stone-950 dark:text-stone-100 italic leading-relaxed pr-8">
                           {translate('mood.burnout_desc')}
                        </Text>
                     </View>
                     <View className="flex-row justify-between items-end z-10">
                         <View className="px-4 py-2 bg-white/60 dark:bg-black/30 rounded-full">
                            <Text className="text-xs font-bold text-stone-900 dark:text-stone-100">{translate('mood.start_analysis')}</Text>
                         </View>
                         <Battery color="#44403c" width={36} height={36} />
                     </View>
                  </View>
              </TouchableOpacity>
            </AnimatedCard>

        </View>
      </ScrollView>
    </View>
  );
}
