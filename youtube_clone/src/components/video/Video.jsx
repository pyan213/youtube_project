import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import styles from "./Video.module.css";

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

const Video = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const state = location.state;
  const [videos, setVideos] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const { title, channelTitle, publishedAt, description } = state;
  const search = state?.title?.replace(/ /g, "+") || "";
  console.log(search);

  useEffect(() => {
    if (!search) return;

    console.log("useEffect 실행");

    const fetchRelatedVideos = async () => {
      try {
        const res = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${search}&key=${API_KEY}&type=video`
        );
        const data = await res.json();
        setVideos(data.items);
      } catch (error) {
        console.error("유튜브 추천 영상 로드 실패:", error);
      }
    };

    fetchRelatedVideos();
  }, [search, API_KEY, videoId]);

  const onReady = (event) => {
    console.log("🎬 Player ready", event.target);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          <div className={styles.videoIframe}>
            <YouTube
              videoId={videoId}
              opts={{
                width: "940",
                height: "530",
                playerVars: { autoplay: 1, playsinline: 1 },
              }}
              onReady={onReady}
            />
          </div>
          <div className={styles.videoTitle}>{title}</div>
          <div className={styles.channelTitle}>{channelTitle}</div>
          <div className={styles.videoInfo}>
            <div className={styles.videoUploadedAt}>
              {getTimeAgo(publishedAt)}
              <p className={styles.videoPublishedAt}>{publishedAt}</p>
            </div>
            <div className={styles.videoDescription}>{description}</div>
          </div>
        </div>

        <ul className={styles.videoList}>
          {videos
            // .filter((video) => video.id.kind === "youtube#video")
            .map((video) => (
              <button
                key={video.id.videoId} // key는 button에 적용
                className={styles.relatedVideoButton}
                onClick={() =>
                  navigate(`/video/${video.id.videoId}`, {
                    state: {
                      title: video.snippet.title,
                      channelTitle: video.snippet.channelTitle,
                      description: video.snippet.description,
                      publishedAt: video.snippet.publishedAt,
                      // getTimeAgo: getTimeAgo(video.snippet.publishedAt),
                    },
                  })
                }
              >
                <li key={video.id.videoId} className={styles.videoItem}>
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className={styles.videoThumbnail}
                  />
                  <div className={styles.relatedVideoInfo}>
                    <h2 className={styles.relatedVideoTitle}>
                      {decodeHTML(video.snippet.title)}
                    </h2>
                    <p className={styles.relatedVideoChannel}>
                      {decodeHTML(video.snippet.channelTitle)}
                    </p>
                  </div>
                </li>
              </button>
            ))}
        </ul>
      </div>
    </>
  );
};

export default Video;
