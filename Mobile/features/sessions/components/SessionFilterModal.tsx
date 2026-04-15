import React, { useEffect, useState } from "react";
import { Modal, ScrollView, View, Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { X, Check } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedLabels: string[], availableOnly: boolean) => void;
    availableLabels: string[];
    currentSelectedLabels: string[];
    currentAvailableOnly: boolean;
}

export function SessionFilterModal({
    visible,
    onClose,
    onApply,
    availableLabels,
    currentSelectedLabels,
    currentAvailableOnly,
}: FilterModalProps) {
    const [tempSelectedLabels, setTempSelectedLabels] = useState<string[]>([]);
    const [tempAvailableOnly, setTempAvailableOnly] = useState(false);

    useEffect(() => {
        if (visible) {
            setTempSelectedLabels(currentSelectedLabels);
            setTempAvailableOnly(currentAvailableOnly);
        }
    }, [visible, currentSelectedLabels, currentAvailableOnly]);

    const tempActiveFilterCount = tempSelectedLabels.length + (tempAvailableOnly ? 1 : 0);

    const toggleTempLabel = (label: string) => {
        setTempSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
    };

    const clearTempFilters = () => {
        setTempSelectedLabels([]);
        setTempAvailableOnly(false);
    };

    const handleApply = () => {
        onApply(tempSelectedLabels, tempAvailableOnly);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/40">
                <Pressable className="flex-1" onPress={onClose} />

                <View className="bg-white rounded-t-[32px] p-6 max-h-[85%]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-slate-900">Filters</Text>
                        <Pressable
                            onPress={onClose}
                            className="p-2 bg-slate-100 rounded-full"
                        >
                            <Icon as={X} size={24} className="text-slate-500" />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Beschikbaarheid
                        </Text>
                        <Pressable
                            onPress={() => setTempAvailableOnly(!tempAvailableOnly)}
                            className="flex-row items-center mb-8 active:opacity-80"
                        >
                            <View
                                className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${tempAvailableOnly
                                        ? 'bg-slate-900 border-slate-900'
                                        : 'bg-white border-slate-300'
                                    }`}
                            >
                                {tempAvailableOnly && <Icon as={Check} size={14} className="text-white" strokeWidth={3} />}
                            </View>
                            <Text className="text-base font-semibold text-slate-800">
                                Toon alleen sessies met plek
                            </Text>
                        </Pressable>

                        {availableLabels.length > 0 && (
                            <>
                                <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                    Onderwerpen
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {availableLabels.map(label => {
                                        const isSelected = tempSelectedLabels.includes(label);
                                        return (
                                            <Pressable
                                                key={label}
                                                onPress={() => toggleTempLabel(label)}
                                                className={`px-4 py-2.5 rounded-full border ${isSelected
                                                        ? 'bg-slate-900 border-slate-900'
                                                        : 'bg-white border-slate-200'
                                                    }`}
                                            >
                                                <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                                    {label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View className="flex-row gap-3 pt-2">
                        {tempActiveFilterCount > 0 && (
                            <Button
                                variant="outline"
                                className="flex-1 rounded-2xl border-slate-200"
                                onPress={clearTempFilters}
                            >
                                <Text className="font-semibold text-slate-700">Wis alles</Text>
                            </Button>
                        )}
                        <Button
                            className="flex-[2] rounded-2xl bg-slate-900"
                            onPress={handleApply}
                        >
                            <Text className="font-semibold text-white">Toepassen</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}