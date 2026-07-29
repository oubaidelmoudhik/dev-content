# Liquid Glass Styling Guide

## 🎨 Core Identity
The LinkedIn AI Draft Studio utilizes a proprietary, modern interface standard dubbed **"Liquid Glass"**. It fundamentally distances itself from standard flat UI kits, relying heavily on translucent depth, extreme continuous curved angles, and colorful refractive rim lighting.

---

## 1. Environmental Backgrounds
To assure hardware fluidity and absolute zero GPU bottleneck scrolling (60fps), we strictly avoid `mix-blend-multiply` in conjunction with `animation` frames. 
Instead, we rely on **Static Blurred Geometry**:
```html
<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-cyan-200/60 rounded-full blur-[100px]"></div>
    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-indigo-200/50 rounded-full blur-[100px]"></div>
    <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[50%] bg-blue-200/60 rounded-full blur-[100px]"></div>
</div>
```

---

## 2. Basic Glass Panels (Liquid Glass Component)
Interactive UI cards must represent extremely thick panes of refractive glass floating over the color environment.

**Core Ruleset:**
*   **Transparency Injection:** E.g., `bg-white/40` or `bg-white/60`. Must be completely transparent driven.
*   **Gaussian Depth:** Utilizes `backdrop-blur-3xl` or `backdrop-blur-md` depending on layer elevation overlap.
*   **Extreme Geometry:** Continual smooth sweeping edges utilizing `rounded-[2rem]` or `rounded-[3rem]`. Standard `rounded-lg` borders are banned across parent cards.
*   **Refractive Rim Lighting:** Strict `.border.border-white/80` or `border-white/60` classes must be placed, creating pseudo "light" reflecting upon the edges.
*   **Shadow Drop:** Dense `shadow-2xl` mapping back out towards a darker environment creates 3D popping effects.

*Example Glass Component:*
```html
<div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[2rem] shadow-2xl">
 ...
</div>
```

---

## 3. Typography
**Primary Engine:** Google's `Outfit` Font Engine (imported purely on `next/font/google`).

*   **Display Headers:** Strict `font-black` limits. Extremely thick geometries.
*   **Primary Highlights:** Deep gradient overlays.
    ```css
    .bg-gradient-to-r .from-blue-600 .to-purple-600 .bg-clip-text .text-transparent
    ```
*   **Body & Sub:* Slate architecture constraints (`text-slate-600`). Heavy use of `font-bold` for smaller text elements maintaining sharp rendering across heavily blurred screens.

---

## 4. Micro-Interactions (Physicality)
UX navigation must deliver tactile, bounding elastic physical responses when mouse events trigger.

*   **Elastic Scale:** Force buttons and interactables to react structurally visually globally utilizing:
    `hover:scale-[1.02] active:scale-[0.98]`
*   **Temporal Shift:** All hovers are delayed to exact: `transition-all duration-200` smoothing the frame.

---

## 5. Hollow Inputs & States
Standardizing user TextAreas and manual Type Inputs structurally.

**Input Construction:**
Requires negative inner-shadow lighting mapped internally with clear focus transitions.
```html
<input className="w-full bg-white/60 border border-white/80 shadow-inner rounded-2xl p-6 focus:bg-white focus:border-blue-400 font-bold text-slate-800" />
```

---

## 6. Icons & Signposting
*   **Asset Pack:** `lucide-react` dynamically sized explicitly scaling stroke counts.
*   **Module Enclosures:** Icons are generally stationed inside explicit solid-gradient rounded boxes representing modules or data tags utilizing tight scaling.
```html
<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
    <Icon />
</div>
```
