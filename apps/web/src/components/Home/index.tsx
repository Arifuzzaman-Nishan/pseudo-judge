import React from "react";
import { Button } from "../ui/button";
import Lottie from "../Shared/Lottie";

const BgLayerUp = () => {
  return (
    <div
      className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
};

const BgLayerDown = () => {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
};

const Home = () => {
  return (
    <section className="relative w-full overflow-hidden overflow-x-clip bg-slate-100 lg:h-screen isolate">
      <BgLayerUp />
      <div className="lg:h-full flex items-center bg-pattern">
        <div className="container mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full px-4 mb-10 lg:w-1/2 lg:mb-0 flex items-center prose max-w-full mt-36 lg:mt-0">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-relaxed">
                  <span className="text-indigo-500 block mb-2">
                    Pseudo Judge
                  </span>
                  <span>Master the Art of Problem Solving</span>
                </h1>

                <p className="text-lg leading-8 text-gray-600">
                  Dive into a world of coding challenges from UVA, LightOJ, and
                  Timus Online Judge. Track your progress, sharpen your skills,
                  and master problem-solving with Pseudo Judge – your partner in
                  programming excellence!
                </p>
                <div className="">
                  <Button className="py-6">Start Coding</Button>
                </div>
              </div>
            </div>
            <div className="max-w-2xl mx-auto px-4 mb-10 lg:w-1/2 lg:mb-0 hidden md:block">
              <Lottie src="/assets/lottiefiles/coding.lottie" />
            </div>
          </div>
        </div>
      </div>
      <BgLayerDown />
    </section>
  );
};

export default Home;
