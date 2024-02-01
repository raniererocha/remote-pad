import AudioPlayer from "react-h5-audio-player";
import "./style.css";
import { LegacyRef, forwardRef from "react";
import H5AudioPlayer from "react-h5-audio-player";

export const AudioPlayerComponent = forwardRef(function AudioPlayerComponent(props : {url: string} , ref: LegacyRef<H5AudioPlayer>{

    return (
        <div className="px-6 py-2">
            <AudioPlayer
                ref={ref}
                autoPlay
                onPlay={() => console.log("onPlay")}
                src={props.url}
            />
        </div>
    );
});
