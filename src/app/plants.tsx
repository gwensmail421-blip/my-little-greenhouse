import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlantCard } from '@/components/plant-card';
import { PlantAvatar } from '@/components/plant-sprite';
import { searchPlants, type Plant, type PlantId } from '@/data/plants';
import { useMyPlants } from '@/lib/my-plants';
import { colors, fonts } from '@/theme';

export default function PlantsScreen() {
  const insets = useSafeAreaInsets();
  const { plants, has, toggle } = useMyPlants();
  const [query, setQuery] = useState('');
  const [card, setCard] = useState<{ list: PlantId[]; index: number } | null>(null);

  const results = searchPlants(query);
  const open = (list: Plant[], id: PlantId) => setCard({ list: list.map((p) => p.id), index: list.findIndex((p) => p.id === id) });

  return (
    <View style={styles.root}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 90, paddingHorizontal: 20 }}>
        <Text style={styles.title}>My plants</Text>
        <Text style={styles.lede}>Only what you grow shows up in your greenhouse and reminders.</Text>

        {plants.length > 0 && (
          <Animated.View layout={LinearTransition} style={styles.mine}>
            {plants.map((p) => (
              <Animated.View key={p.id} entering={FadeIn} layout={LinearTransition}>
                <Pressable style={[styles.mineTile, { backgroundColor: p.tint }]} onPress={() => open(plants, p.id)} accessibilityLabel={`Open ${p.name}`}>
                  <PlantAvatar sprite={p.sprite} size={44} />
                  <Text style={styles.mineName} numberOfLines={1}>
                    {p.shortName}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <Text style={styles.h2}>Find a plant</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Try tomato, salad greens or basil"
          placeholderTextColor="#A39587"
          style={styles.search}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search plants"
        />

        <View style={styles.results}>
          {results.map((p) => {
            const added = has(p.id);
            return (
              <Pressable key={p.id} style={styles.row} onPress={() => open(results, p.id)} accessibilityLabel={`Read about ${p.name}`}>
                <View style={[styles.rowArt, { backgroundColor: p.tint }]}>
                  <PlantAvatar sprite={p.sprite} size={40} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{p.name}</Text>
                  <Text style={styles.rowNote} numberOfLines={2}>
                    {p.cold}
                  </Text>
                </View>
                <Pressable
                  onPress={() => toggle(p.id)}
                  style={[styles.add, added && styles.added]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={added ? `Remove ${p.name}` : `Add ${p.name}`}>
                  <Text style={[styles.addText, added && { color: colors.paper }]}>{added ? '✓ Added' : '+ Add'}</Text>
                </Pressable>
              </Pressable>
            );
          })}
          {results.length === 0 && (
            <View style={styles.none}>
              <Text style={styles.noneTitle}>Not in the guide yet</Text>
              <Text style={styles.noneBody}>
                We&apos;re adding more plants, each one checked against university extension sources first.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <PlantCard
        list={card?.list ?? []}
        index={card ? card.index : null}
        status={(id) => (has(id) ? 'In your greenhouse' : 'Not added yet')}
        onIndexChange={(index) => setCard((c) => (c ? { ...c, index } : c))}
        onClose={() => setCard(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  title: { fontFamily: fonts.displayLight, fontSize: 30, letterSpacing: 1.5, color: colors.ink },
  lede: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 6, marginBottom: 18 },
  mine: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  mineTile: { width: 76, alignItems: 'center', paddingTop: 8, paddingBottom: 7, borderRadius: 18, gap: 2 },
  mineName: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.inkSoft },
  h2: { fontFamily: fonts.displayBold, fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: colors.heading, marginBottom: 10 },
  search: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.sand,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  results: { marginTop: 14, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 20, backgroundColor: colors.sandDeep },
  rowArt: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  rowNote: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.muted, marginTop: 2 },
  add: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.pine },
  added: { backgroundColor: colors.pine },
  addText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.pine },
  none: { padding: 16, borderRadius: 18, backgroundColor: colors.nowBg },
  noneTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink, marginBottom: 4 },
  noneBody: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.inkSoft },
});
