import { motion, type Variants } from "framer-motion";
import {
    Instagram,
    ArrowUpRight,
    Heart,
    Sparkles,
} from "lucide-react";

import founder1 from "@/assets/founders.jpeg";
import founder2 from "@/assets/exp-candles.jpg";
import soraLogo from "@/assets/sora_logo.jpg";
import sociallnking from "@/assets/sociallnking.jpeg";

const founders = [
    {
        name: "Anshika Jain",
        role: "Founder",
        company: "Founder of Sora Events",
        image: founder1,
        logo: soraLogo,
        instagram: "https://instagram.com/sora.events",
        username: "@sora.events",
        accent: "Founder",
    },
    {
        name: "Neha Chaudhary",
        role: "Co-Founder",
        company: "Community Builder & Social Networking Platform",
        image: founder2,
        instagram: "https://www.instagram.com/_nehaa2904_",
        username: "@sociallnking.in",
        accent: "Co-Founder",
    },
];

const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export function Founders() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F6] via-[#FFF7F4] to-white py-24">

            {/* Decorative Blob */}
            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-pink-300/20 blur-[120px]"
            />

            {/* Decorative Blob */}
            <motion.div
                animate={{
                    x: [0, -30, 0],
                    y: [0, 35, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-rose-200/20 blur-[120px]"
            />

            {/* Floating Sparkles */}

            <Sparkles className="absolute left-[8%] top-28 h-6 w-6 text-pink-400 animate-pulse" />

            <Sparkles className="absolute right-[12%] top-52 h-5 w-5 text-pink-300 animate-pulse" />

            <div className="relative mx-auto max-w-7xl px-5">

                {/* Heading */}

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mx-auto max-w-3xl text-center"
                >

                    <span className="tracking-[0.45em] uppercase text-primary text-sm font-semibold">
                        Meet The Team
                    </span>

                    <div className="mt-5 flex items-center justify-center gap-4">

                        <div className="h-px w-16 bg-primary/30"></div>

                        <Heart className="h-5 w-5 fill-primary text-primary" />

                        <div className="h-px w-16 bg-primary/30"></div>

                    </div>

                    <h2 className="mt-8 text-5xl font-semibold leading-tight text-ink sm:text-6xl">

                        The People Behind

                        <br />

                        <span className="text-script italic text-primary">

                            Every Experience

                        </span>

                    </h2>

                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-muted-foreground">

                        Every memorable event begins with passionate people.
                        Meet the founders creating experiences that inspire
                        connection, creativity and unforgettable memories.

                    </p>

                </motion.div>
            </div>

            {/* Founder Cards */}

            <div className="mt-20 space-y-12">
                <div className="mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]"
                    >
                        

                        {/* Bottom Content */}

                        {/* Bottom Content */}

                        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-10">
                            {/* Sora Events */}

                            <div className="flex h-full flex-col rounded-3xl bg-rose-50/60 p-7">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                                    Event Organizer
                                </p>

                                <h3 className="mt-3 text-3xl font-semibold text-ink">
                                    Sora Events
                                </h3>

                                <p className="mt-5 flex-1 leading-8 text-muted-foreground">
                                    Sora Events specializes in planning and organizing unforgettable events,
                                    creative workshops, and unique social experiences. As our official event
                                    partner, they help turn every gathering into a memorable experience that
                                    people cherish long after it ends.
                                </p>

                                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <img
                                        src={soraLogo}
                                        alt="Sora Events"
                                        className="h-12 w-12 rounded-xl object-cover"
                                    />

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            Official Partner
                                        </p>

                                        <h4 className="font-semibold text-ink">
                                            Sora Events
                                        </h4>
                                    </div>
                                </div>

                                <a
                                    href="https://www.instagram.com/soraeventsofficial"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-white transition hover:scale-105"
                                >
                                    <Instagram size={18} />
                                    @soraeventsofficial
                                </a>
                            </div>

                            {/* SocialLnking */}

                            <div className="flex h-full flex-col rounded-3xl bg-rose-50/60 p-7">
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                                    Social Media Manager
                                </p>

                                <h3 className="mt-3 text-3xl font-semibold text-ink">
                                    SocialLnking
                                </h3>

                                <p className="mt-5 flex-1 leading-8 text-muted-foreground">
                                    SocialLnking is our official community and social media partner, helping
                                    connect people through creative content, digital marketing, and event
                                    promotions. Together, we build stronger communities and bring every event
                                    to a wider audience.
                                </p>
                                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <img
                                        src={sociallnking}
                                        alt="SocialLnking"
                                        className="h-12 w-12 rounded-xl object-cover"
                                    />

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            Official Partner
                                        </p>

                                        <h4 className="font-semibold text-ink">
                                            SocialLnking
                                        </h4>
                                    </div>
                                </div>

                                <a
                                    href="https://www.instagram.com/_nehaa2904_"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-white transition hover:scale-105"
                                >
                                    <Instagram size={18} />
                                    @sociallnking
                                </a>
                            </div>
                        </div>

                        <div className="border-t bg-rose-50 p-8 text-center">
                            <h3 className="text-script text-4xl text-primary">
                                Creating Memories. Building Communities.
                            </h3>

                            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                                Together, Anshika and Neha are on a mission to make every event a place
                                where strangers become friends and every experience becomes a lasting memory.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}