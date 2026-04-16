import React, { useEffect, useState } from "react";
import { Modal, ScrollView, View, Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { X } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
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
                        <View className="flex-row items-center justify-between mb-8">
                            <View className="flex-1 mr-3">
                                <Label
                                    nativeID="available-filter"
                                    onPress={() => setTempAvailableOnly(!tempAvailableOnly)}
                                    className="text-base font-semibold text-slate-800"
                                >
                                </Label>
                                <Text className="text-sm font-semibold">
                                    Verberg sessies die al volgeboekt zijn
                                </Text>
                            </View>

                            <Switch
                                checked={tempAvailableOnly}
                                onCheckedChange={setTempAvailableOnly}
                                nativeID="available-filter"
                            />
                        </View>

                        {availableLabels.length > 0 && (
                            <>
                                <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 border-t border-slate-200 pt-4">
                                    Onderwerpen
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {availableLabels.map(label => {
                                        const isSelected = tempSelectedLabels.includes(label);
                                        return (
                                            <Button
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
                                            </Button>
                                        );
                                    })}
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View className="flex justify-end flex-row gap-3 pt-2">
                        
                        {tempActiveFilterCount > 0 && (
                            <Button
                                variant="link"
                                onPress={clearTempFilters}
                            >
                                <Text className="font-semibold text-destructive">Wis filters</Text>
                            </Button>
                        )}

                        <Button
                            variant="default"
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