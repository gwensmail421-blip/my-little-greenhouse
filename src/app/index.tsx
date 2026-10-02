import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GreenhouseScene } from '@/components/greenhouse-scene';
import { PlantCard } from '@/components/plant-card';
import { ReminderToast } from '@/components/reminder-toast';
import { PLANTS, seasonNote, type PlantId } from '@/data/plants';
import { SEASONS, TIMES } from '@/data/seasons';
import { useConditions } from '@/lib/conditions';
import { useMyPlants } from '@/lib/my-plants';
import { buildReminders } from '@/lib/reminders';
import { colors, fonts } from '@/theme';

function formatDate(d: Date) {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${weekday} · ${monthDay}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const wx = useConditions();
  const { plants, ids, loaded } = useMyPlants();
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const week = SEASONS[wx.season].week;
  const light = TIMES[wx.time].lightText;
  const reminders = useMemo(
    () => buildReminders({ plants, season: wx.season, lowF: wx.lowF, highF: wx.highF }),
    [plants, wx.season, wx.lowF, wx.highF]
  );
  const reminder = wx.loaded ? reminders.find((r) => !dismissed.includes(r.key)) : undefined;
  const status = (id: PlantId) => `In your greenhouse · ${seasonNote(PLANTS[id], wx.season)}`;
  const openPlant = (id: PlantId) => {
    const i = ids.indexOf(id);
    if (i >= 0) setCardIndex(i);
  };
  const dismiss = () => reminder && setDismissed((d) => [...d, reminder.key]);

  const textColor = light ? '#F4EEE6' : colors.ink;

  return (
    <View style={styles.root}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View style={styles.scene}>
          <GreenhouseScene season={wx.season} time={wx.time} sky={wx.sky} plants={plants} onPlantPress={openPlant} />
          <View style={[styles.topbar, { paddingTop: insets.top + 14, pointerEvents: 'none' }]}>
            <View style={{ flexShrink: 1 }}>
              <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                My Little Greenhouse
              </Text>
              <Text style={[styles.date, { color: textColor }]}>{formatDate(wx.date)}</Text>
            </View>
            <View style={styles.wx}>
              <Text style={[styles.temp, { color: textColor }]}>{wx.tempF != null ? `${wx.tempF}°` : '–'}</Text>
              {wx.lowF != null && wx.highF != null && (
                <Text style={[styles.wxLine, { color: textColor }]}>
                  {wx.lowF}° / {wx.highF}°
                </Text>
              )}
              {wx.humidity != null && <Text style={[styles.wxLine, { color: textColor }]}>{wx.humidity}% humidity</Text>}
            </View>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.h2}>This week</Text>
          <View style={styles.tasks}>
            <Task label="Sow" color={colors.sprout} text={week.sow} />
            <Task label="Tend" color={colors.sky} text={week.tend} />
            <Task label="Harvest" color={colors.clay} text={week.harvest} />
          </View>

          <Text style={[styles.h2, { marginTop: 22 }]}>Growing now</Text>
          {loaded && plants.length === 0 ? (
            <Pressable style={styles.empty} onPress={() => router.navigate('/plants')}>
              <Text style={styles.emptyTitle}>Your shelves are empty</Text>
              <Text style={styles.emptyBody}>
                Add what you&apos;re growing, and your greenhouse, care cards and reminders will fill in to match.
              </Text>
              <Text style={styles.emptyCta}>Add plants ›</Text>
            </Pressable>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {plants.map((p) => (
                <Pressable key={p.id} style={styles.chip} onPress={() => openPlant(p.id)} accessibilityLabel={`Open ${p.name}`}>
                  <View style={[styles.chipDot, { backgroundColor: p.dot }]} />
                  <View>
                    <Text style={styles.chipName}>{p.name}</Text>
                    <Text style={styles.chipNote}>{seasonNote(p, wx.season)}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Text style={styles.place}>
            {wx.error
              ? "Couldn't reach the weather service. Showing the season's scene."
              : wx.usingFallback
                ? `Weather for ${wx.place}. Allow location in Settings to use yours.`
                : wx.place
                  ? `Live weather for ${wx.place}`
                  : 'Live weather for your location'}
          </Text>
        </View>
      </ScrollView>

      {reminder && cardIndex == null && (
        <ReminderToast
          key={reminder.key}
          reminder={reminder}
          top={insets.top + 8}
          onPlantPress={openPlant}
          onDone={dismiss}
          onLater={dismiss}
        />
      )}

      <PlantCard list={ids} index={cardIndex} status={status} onIndexChange={setCardIndex} onClose={() => setCardIndex(null)} />
    </View>
  );
}

function Task({ label, color, text }: { label: string; color: string; text: string }) {
  return (
    <View style={styles.task}>
      <Text style={[styles.taskKey, { color }]}>{label}</Text>
      <Text style={styles.taskText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  scene: { width: '100%', aspectRatio: 380 / 420 },
  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: { fontFamily: fonts.displayLight, fontSize: 18, letterSpacing: 2.2, lineHeight: 22, textTransform: 'uppercase' },
  date: { fontFamily: fonts.body, fontSize: 12.5, letterSpacing: 0.8, marginTop: 6, opacity: 0.85 },
  wx: { alignItems: 'flex-end' },
  temp: { fontFamily: fonts.display, fontSize: 24 },
  wxLine: { fontFamily: fonts.body, fontSize: 12, opacity: 0.85, letterSpacing: 0.4 },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -26,
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  h2: { fontFamily: fonts.displayBold, fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: colors.heading, marginBottom: 12 },
  tasks: { gap: 10 },
  task: { flexDirection: 'row', gap: 10, alignItems: 'baseline' },
  taskKey: { width: 78, fontFamily: fonts.displayBold, fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase' },
  taskText: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 20, color: '#31444A' },
  chips: { gap: 8, paddingRight: 20 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingLeft: 6, paddingRight: 14, borderRadius: 999, backgroundColor: colors.sand },
  chipDot: { width: 26, height: 26, borderRadius: 13 },
  chipName: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.inkSoft },
  chipNote: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted },
  empty: { padding: 16, borderRadius: 18, backgroundColor: colors.nowBg },
  emptyTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink, marginBottom: 4 },
  emptyBody: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.inkSoft },
  emptyCta: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.pine, marginTop: 10 },
  place: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 22 },
});
