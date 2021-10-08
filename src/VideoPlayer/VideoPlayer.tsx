import React, { useState, useEffect, useRef } from "react";
import { Container, Title, Task, TaskContentVideo, Label, TaskContent } from './VideoPlayer.style';

interface IProps {
}

const VideoPlayer = (props: IProps) => {
  let refVideo: any = useRef(null);

  let refCanvas1: any = useRef(null);
  let refCheckboxBlur: any = useRef(null);
  let refCheckboxGray: any = useRef(null);

  let refVideoControls: any = useRef(null);

  const [isPlay, setIsPlay] = useState<boolean>(false)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        refVideo.current.srcObject = stream;
        refVideoControls.current.srcObject = stream;
      })
      .catch(console.log);
  }, []);

  function handleCanvas() {
    if (refVideo.current.ended || refVideo.current.paused) {
      return;
    }

    let context = refCanvas1.current.getContext("2d");

    context.drawImage(
      refVideo.current,
      0,
      0,
      refVideo.current.width,
      refVideo.current.height
    );

    const imageData = context.getImageData(
      0,
      0,
      refCanvas1.current.width,
      refCanvas1.current.height
    );
    const data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      if (refCheckboxGray.current.checked) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
    }

    context.putImageData(
      imageData,
      0,
      0,
      0,
      0,
      refVideo.current.width,
      refVideo.current.height
    );
    context.filter = `blur(${refCheckboxBlur.current.checked ? "8px" : "0"})`;

    setTimeout(handleCanvas, 33);
  }

  function onControlPlay() {

    if (refVideoControls.current.paused) {
      setIsPlay(true)
      refVideoControls.current.play();
    } else {
      setIsPlay(false)
      refVideoControls.current.pause();
    }
  }

  return (
    <Container>
      <Task>
        <Title>
          - Video player that reproduces the webcam
        </Title>
        <video
          ref={refVideo}
          width={700}
          height={400}
          autoPlay
          onPlay={() => {
            handleCanvas()
          }}
        />
      </Task>


      <Task>
        <Title>
          - Canvas manipulation
        </Title>
        <TaskContent>
          <TaskContentVideo>
            <canvas ref={refCanvas1} width={700} height={400} ></canvas>
          </TaskContentVideo>
          <div>
            <Label>
              <input
                ref={refCheckboxGray}
                type="checkbox"
              />
              <span>Gray</span>
            </Label>
            <Label>
              <input
                ref={refCheckboxBlur}
                type="checkbox"
              />
              <span>Blur</span>
            </Label>
          </div>
        </TaskContent>
      </Task>


      <Task>
        <Title>
          - Video player with controls {isPlay ? "true" : "false"}
        </Title>
        <TaskContent>
          <TaskContentVideo>
            <video
              ref={refVideoControls}
              width={700}
              height={400}
            />
          </TaskContentVideo>

          <div>
            <button onClick={onControlPlay}>{isPlay ? "Pause" : "Play"}</button>
          </div>

        </TaskContent>
      </Task>
    </Container>
  )
}

export { VideoPlayer }