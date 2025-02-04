'use client'
import { useRouter } from "next/navigation";

export const ActionButton = ({ children, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full sm:w-auto transition-all duration-300 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
  >
    <div className="min-w-[280px] bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg p-8">
      <div className="flex flex-col items-center gap-3">
        <span className="text-xl font-semibold text-gray-800 tracking-wide">
          {children}
        </span>
        <span className="text-sm text-gray-600 text-center max-w-[200px]">
          {subtitle}
        </span>
      </div>
    </div>
  </button>
);

export const ActionButtons = () => {
  const router = useRouter();
  return <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
    <ActionButton
      subtitle="A sample sponsoring app"
      onClick={async () => {
        console.log("Donate")
        router.push("/donate")
      }}
    >
      SPONSOR ME
    </ActionButton>

    <ActionButton
      subtitle="A sample prepaid utility bill application"
      onClick={() => {
        console.log("Buy prepaid clicked")
        router.push('buy-prepaid')
      }}
    >
      BUY PREPAID CODE
    </ActionButton>
  </div>
};


