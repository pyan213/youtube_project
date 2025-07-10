import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const decodeHTML = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const getTimeAgo = (publishedAt) => {
  const now = new Date();
  const publishedDate = new Date(publishedAt);
  const diffMs = now - publishedDate;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) return `${diffYear}년 전`;
  if (diffMonth > 0) return `${diffMonth}개월 전`;
  if (diffDay > 0) return `${diffDay}일 전`;
  if (diffHour > 0) return `${diffHour}시간 전`;
  if (diffMin > 0) return `${diffMin}분 전`;
  return "방금 전";
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!API_KEY) return;
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=25&key=${API_KEY}&type=video`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("🔥 인기 영상", data.items);
        setVideos(data.items);
      })
      .catch((error) => {
        console.error("인기 영상 불러오기 실패:", error);
      });
  }, [API_KEY, navigate]);

  return (
    <>
      <ul className={styles.videoList}>
        {videos
          // .filter((video) => video.id.kind === "youtube#video")
          .map((video) => (
            <li
              key={video.id}
              className={styles.videoItem}
              onClick={() =>
                navigate(`/video/${video.id}`, {
                  state: {
                    title: decodeHTML(video.snippet.title),
                    channelTitle: decodeHTML(video.snippet.channelTitle),
                    publishedAt: video.snippet.publishedAt,
                    // getTimeAgo: getTimeAgo(video.snippet.publishedAt),
                    description: decodeHTML(video.snippet.description),
                    videoId: video.id.videoId,
                  },
                })
              }
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className={styles.videoThumbnail}
              />
              <h2 className={styles.videoTitle}>
                {decodeHTML(video.snippet.title)}
              </h2>
              <p className={styles.videoChannel}>
                {decodeHTML(video.snippet.channelTitle)}
              </p>
              <p className={styles.videoDate}>
                {getTimeAgo(video.snippet.publishedAt)}
              </p>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Home;
