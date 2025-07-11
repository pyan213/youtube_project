import React from "react";
import { useYoutubeApi } from "../context/YoutubeApiContext";
import { useQuery } from "@tanstack/react-query";
import VideoCard from "./VideoCard";

// export default function RealatedVideos({ id }) {
export default function RealatedVideos({ title }) {
  const { youtube } = useYoutubeApi();
  const {
    isLoading,
    error,
    data: videos,
  } = useQuery({
    // queryKey: ["related", id],
    queryKey: ["related", title],
    // queryFn: () => youtube.relatedVideos(id),
    queryFn: () => youtube.search(title),
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Something is wrong:{error.toString()}</p>}
      {videos && (
        <ul>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </ul>
      )}
    </>
  );
}
