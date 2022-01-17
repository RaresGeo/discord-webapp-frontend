import React, { useEffect } from "react";
import golden_bender from "../assets/golden_bender.jpg";

const Home: React.FC = () => {
  const linkStyle = `w-fit transition hover:translate-x-1 ease-in-out hover:text-black text-dark-white py-1 font-semibold text-lg before:block before:absolute before:-inset-1 before:-skew-y-2 before:-z-10 hover:before:bg-white hover:before:border-b-4 before:border-b-0 before:border-gray-600 relative inline-block`;

  return (
    <div className="minus-64 flex flex-col sm:flex-row items-center justify-evenly">
      <div className="flex flex-col justify-evenly h-full sm:w-full sm:w-2/5 p-6 sm:p-12">
        <h1 className="font-extrabold text-5xl py-6 text-dark-white">Monitor voice statistics and reward active users</h1>
        <div>
          <p className="font-semibold text-dark-gray text-xl py-3 sm:w-3/5">
            Golden bender provides an activity based currency system with fun commands, maintaining a solid community incentive.
          </p>
          <p className="font-semibold text-dark-gray text-xl py-3 sm:w-3/5">
            Invite Golden Bender and easily customize your server's config through an online, easy to use dashboard
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center sm:w-2/5">
        <img className="w-11/12 sm:w-3/5 rounded-lg mb-12" src={golden_bender} />
        <div className="w-4/5 py-5">
          <p className="text-dark-gray text-md py-1">Please note that this is a work in progress, an open source effort, and the work of a lone developer.</p>
          <p className="text-dark-gray text-xs pb-8">
            Be especially accepting of UI/UX design errors and mistakes as I am by no means an artist or frontend expert
          </p>
          <div className="flex flex-col">
            <a href="https://github.com/RaresGeo/discord-voice-currency" className={linkStyle}>
              Currently running bot prototype
            </a>
            <a href="https://github.com/RaresGeo/discord-webapp-backend" className={linkStyle}>
              Webapp backend
            </a>
            <a href="https://github.com/RaresGeo/discord-webapp-frontend" className={linkStyle}>
              Webapp frontend
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
