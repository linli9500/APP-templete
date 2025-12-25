import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ComplexDecodingOverlay } from '@/components/analysis/ComplexDecodingOverlay';
import { Text } from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from '@/components/ui/icons';

export default function TestAnimationPage() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <ComplexDecodingOverlay />

            <View style={{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10000 }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white/10 rounded-full items-center justify-center backdrop-blur-md"
                    style={{ transform: [{ rotate: '180deg' }] }}
                >
                     <ArrowRight color="white" width={20} height={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
