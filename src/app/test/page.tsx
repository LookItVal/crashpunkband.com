import LineGroup from "@/components/CRASHTheme/LineGroup";

export default function TestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-100 h-100 overflow-visible">
        <LineGroup start={{ x: 0, y: 50 }} end={{ x: 100, y: 50 }} />
      </svg>
    </main>
  );
}