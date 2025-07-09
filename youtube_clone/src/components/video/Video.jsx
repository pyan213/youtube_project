import React from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";

const Video = () => {
  const { videoId } = useParams();

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      playsinline: 1,
    },
  };

  const onReady = (event) => {
    console.log("🎬 Player ready", event.target);
  };

  return (
    <div>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
};

export default Video;
