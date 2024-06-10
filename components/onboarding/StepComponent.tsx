

export default function StepComponent({stepNumber, stepText}: {stepNumber: number, stepText: string}) {
    return (
    <div className="flex items-center">
        <span className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
          {stepNumber}
        </span>
        <h2 className="ml-4 text-lg leading-6 font-medium text-gray-900">{stepText}</h2>
      </div>
    )
}