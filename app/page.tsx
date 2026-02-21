import logger from "@/lib/logger";
import Image from "next/image";

import { PageContent } from "@/components/layout/main-layout";

export default function Home() {
  logger.info({ pino: 'logger' }, 'pino')
  return (
    <PageContent className="flex flex-col items-center justify-center min-h-[80vh]">
      <Image
        className="dark:invert mb-12"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-12">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to Astromagy
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Your personal astrological assistant.
        </p>
      </div>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <a
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          href="/setup"
        >
          Get Started
        </a>
      </div>
    </PageContent>
  );
}
