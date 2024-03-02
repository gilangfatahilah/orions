import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-dvh w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <div className="mb-4 w-full flex justify-center items-center">
          <Badge variant="hero">Your Inventory Odyssey</Badge>
        </div>
        <h1 className="pb-2 text-4xl tracking-tight leading-8 md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Leading the Way to Seamless Inventory Solutions.
        </h1>
        <p className="mt-2 font-normal text-base text-neutral-300 max-w-4xl text-center mx-auto">
          Orions is an inventory management app that brings cosmic precision and efficiency to your stock management. 
          With intuitive features and in-depth analytics, Orions allows you to track inventory in real-time, optimize ordering,
          manage shipping, and analyze sales trends to make better and faster decisions.
        </p>
        <div className="pt-6 w-full flex justify-center items-center">
          <Link href={'/auth/signin'}>
            <Button variant="shimer" size="lg">Sign In Now</Button>    
          </Link> 
        </div>
      </div>
    </div>
  );
}
