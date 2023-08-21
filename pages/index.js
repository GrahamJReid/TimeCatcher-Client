/* eslint-disable @next/next/no-css-tags */

/* eslint-disable @next/next/no-img-element */
function Home() {
  return (
    <>
      <div className="parallax_wrapper">
        <div className="parallax_group intro_screen" id="intro">
          <h1>TimeCatcher</h1>
        </div>

        <div className="parallax_group" id="group-1">
          <div className="parallax_layer base_layer">
            base layer page
          </div>
          <div className="parallax_layer mid_layer">
            Gallery
          </div>
        </div>

        <div className="parallax_group" id="group-2">
          <div className="parallax_layer mid_layer">
            <div>mid Layer</div>
          </div>
          <div className="parallax_layer top_layer">
            Image Form
          </div>
        </div>

        <div className="parallax_group outro_screen" id="outro">
          outro screen
        </div>
      </div>
    </>
  );
}

export default Home;
