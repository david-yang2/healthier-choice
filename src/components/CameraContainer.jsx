import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const CameraContainer = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [pictureTaken, setPictureTaken] = useState(false);

  const { imageFile, setImageFile } = useContext(ImageContext);

  const navigate = useNavigate();

  const constraints = {
    video: {
      facingMode: "environment",
    },
  };
  // get camera ref

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.error(err));
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = photoRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // draw video frame
    ctx.drawImage(video, 0, 0, width, height);

    // get pixel data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // preprocess pixels to get better accuracy from OCR
    /* change original image to a more black text and white background */
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
  };

  const submitPhoto = async () => {
    {
      /* takephoto function returns a promise that resolves to a Blob */
    }
    const newImage = await takePhoto();
    setImageFile(newImage);
    setPictureTaken(true);
  };

  useEffect(() => {
    if (imageFile) {
      navigate("/display");
      return; // stop execution of getVideo if imageFile is set
    }
    getVideo();
  }, [imageFile]);

  return (
    <div style={styles.backgroundCover} className="flex flex-col">
      <div style={styles.overlay} className="flex flex-col h-full px-4 py-4">
        <div className="flex flex-col flex-1 min-h-0 rounded-xl bg-white/80 shadow-sm backdrop-blur">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 px-4 py-3">
            <div className="flex items-start justify-center gap-4">
              <div>
                <div className="text-2xl font-semibold">
                  Capture ingredients
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 min-h-0 items-center justify-center p-4">
            <div className="relative w-full max-w-xl flex-1 min-h-[260px] overflow-hidden rounded-lg bg-black">
              <canvas
                ref={photoRef}
                className={`absolute inset-0 h-full w-full object-cover ${
                  !pictureTaken ? "hidden" : "block"
                }`}
              />
              <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover ${
                  pictureTaken ? "hidden" : "block"
                }`}
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/70 px-4 py-4">
            <div className="flex flex-col gap-3 items-center">
              <div className=" text-gray-600">
                For better results, make sure the text is sharp, flat, and fully
                visible.
              </div>
              <button
                className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700"
                onClick={submitPhoto}
              >
                <i className="fa-solid fa-camera text-lg" />
                Snap photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraContainer;

const styles = {
  backgroundCover: {
    height: "100dvh",
    width: "100%",
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
  },
  overlay: {
    height: "100%",
    width: "100%",
    padding: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};
