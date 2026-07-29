/**
 * Static blurred geometry background — Liquid Glass environment.
 * GPU-friendly: no mix-blend-multiply, no animation frames.
 * Pure static CSS blur, pointer-events-none so it never blocks interaction.
 */
export default function BackgroundGeometry() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-cyan-200/60 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-indigo-200/50 rounded-full blur-[100px]" />
      <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[50%] bg-blue-200/60 rounded-full blur-[100px]" />
    </div>
  );
}
