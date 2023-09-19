/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-css-tags */

import { useEffect } from 'react';
import GalleryCarousel from '../components/home/Gallery';
import FollowedUsersTimelines from '../components/home/FollowedUsersTimelines';
import FollowedThreads from '../components/home/FollowedThreads';

/* eslint-disable @next/next/no-img-element */
function Home() {
  useEffect(() => {
    document.title = 'TimeCatcher';
  }, []);
  return (

    <>

      <div className="parallax_wrapper">
        <div className="parallax_group intro_screen" id="intro">
          <div className="homePageTitleDiv">
            <img src="/TimeCatcherLogo.png" className="homePageLogo" />
            <h1 className="homePageTitle">TimeCatcher</h1>
          </div>
        </div>

        <div className="parallax_group" id="group-1">
          <div className="parallax_layer base_layer">
            <></>
          </div>
          <div className="parallax_layer top_layer">

            <GalleryCarousel />

          </div>
        </div>

        <div className="parallax_group" id="group-2">
          <div className="parallax_layer mid_layer">
            <div><></></div>
          </div>
          <div className="parallax_layer top_layer">
            <FollowedThreads />
          </div>
        </div>

        <div className="parallax_group outro_screen" id="outro">
          <div className="parallax_layer top_layer">
            <FollowedUsersTimelines />
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;
