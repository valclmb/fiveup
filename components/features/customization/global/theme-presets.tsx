"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GlobalStylesFormValues } from "./global-styles-form";

export type ThemePresetId =
  | "default"
  | "ocean"
  | "forest"
  | "sunset"
  | "midnight"
  | "minimal"
  | "vibrant";

export const THEME_PRESETS: {
  id: ThemePresetId;
  label: string;
  values: GlobalStylesFormValues;
}[] = [
    {
      id: "default",
      label: "Default",
      values: {
        font: "inter",
        cornerRoundness: "md",
        buttonCornerRoundness: "md",
        borderColor: "#e5e7eb",
        buttonBgColor: "#000000",
        buttonTextColor: "#FFFFFF",
        starsColor: "#FFD230",
        bgColor: "#FFFFFF",
        textColor: "#000000",
        cardColor: "#FFFFFF",
      },
    },
    {
      id: "ocean",
      label: "Ocean",
      values: {
        font: "dm-sans",
        cornerRoundness: "lg",
        buttonCornerRoundness: "lg",
        borderColor: "#0ea5e9",
        buttonBgColor: "#0369a1",
        buttonTextColor: "#FFFFFF",
        starsColor: "#38bdf8",
        bgColor: "#f0f9ff",
        textColor: "#0c4a6e",
        cardColor: "#FFFFFF",
      },
    },
    {
      id: "forest",
      label: "Forest",
      values: {
        font: "outfit",
        cornerRoundness: "md",
        buttonCornerRoundness: "md",
        borderColor: "#22c55e",
        buttonBgColor: "#15803d",
        buttonTextColor: "#FFFFFF",
        starsColor: "#4ade80",
        bgColor: "#f0fdf4",
        textColor: "#14532d",
        cardColor: "#FFFFFF",
      },
    },
    {
      id: "sunset",
      label: "Sunset",
      values: {
        font: "fraunces",
        cornerRoundness: "rounded",
        buttonCornerRoundness: "rounded",
        borderColor: "#f59e0b",
        buttonBgColor: "#ea580c",
        buttonTextColor: "#FFFFFF",
        starsColor: "#fbbf24",
        bgColor: "#fffbeb",
        textColor: "#78350f",
        cardColor: "#FFFFFF",
      },
    },
    {
      id: "midnight",
      label: "Midnight",
      values: {
        font: "inter",
        cornerRoundness: "sm",
        buttonCornerRoundness: "sm",
        borderColor: "#334155",
        buttonBgColor: "#3b82f6",
        buttonTextColor: "#FFFFFF",
        starsColor: "#60a5fa",
        bgColor: "#0f172a",
        textColor: "#f1f5f9",
        cardColor: "#1e293b",
      },
    },
    {
      id: "minimal",
      label: "Minimal",
      values: {
        font: "inter",
        cornerRoundness: "none",
        buttonCornerRoundness: "none",
        borderColor: "#e2e8f0",
        buttonBgColor: "#64748b",
        buttonTextColor: "#FFFFFF",
        starsColor: "#94a3b8",
        bgColor: "#f8fafc",
        textColor: "#334155",
        cardColor: "#FFFFFF",
      },
    },
    {
      id: "vibrant",
      label: "Vibrant",
      values: {
        font: "outfit",
        cornerRoundness: "lg",
        buttonCornerRoundness: "lg",
        borderColor: "#8b5cf6",
        buttonBgColor: "#6d28d9",
        buttonTextColor: "#FFFFFF",
        starsColor: "#a78bfa",
        bgColor: "#faf5ff",
        textColor: "#4c1d95",
        cardColor: "#FFFFFF",
      },
    },
  ];

export interface ThemePresetsProps {
  value: ThemePresetId | "";
  onPresetSelect: (values: GlobalStylesFormValues, presetId: ThemePresetId) => void;
}

function PresetColorDots({ preset }: { preset: (typeof THEME_PRESETS)[number] }) {
  const colors = [
    preset.values.bgColor,
    preset.values.buttonBgColor,
    preset.values.starsColor,
    preset.values.borderColor,
  ];
  return (
    <span className="flex gap-1 shrink-0">
      {colors.map((color, i) => (
        <span
          key={i}
          className="size-2 rounded-full border border-white/10 shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ThemePresets({ value, onPresetSelect }: ThemePresetsProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(id) => {
        const preset = THEME_PRESETS.find((p) => p.id === id);
        if (preset) {
          onPresetSelect(preset.values, preset.id);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Theme presets" />
      </SelectTrigger>
      <SelectContent position="popper">
        {THEME_PRESETS.map((preset) => (
          <SelectItem key={preset.id} value={preset.id} className="gap-2">
            <PresetColorDots preset={preset} />
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
