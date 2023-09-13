import Image from 'next/image'

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-bounce">
        <Image alt="loader" fill src="/Logo.svg" />
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
