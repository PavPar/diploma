import { useEffect, useState } from "react";

const useMyRecorder = () => {
    const [audioURL, setAudioURL] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState()
    useEffect(() => {
        // Lazily obtain recorder first time we're recording.
        if (recorder === null) {
            if (isRecording) {
                requestRecorder().then(setRecorder, console.error);
            }
            return;
        }

        let data = [];
        // Manage recorder state.
        if (isRecording) {
            recorder.start();
        } else {
            recorder.stop();
        }

        // Obtain the audio when ready.
        const handleData = e => {
            setAudioURL(URL.createObjectURL(e.data));
        };

        recorder.addEventListener("dataavailable", handleData);
        // recorder.addEventListener("stop", handleStop)
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const getRecordingBlob = () => {
        return audioBlob
    }
    return [audioURL, isRecording, startRecording, stopRecording, getRecordingBlob];
};

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
}



export default useMyRecorder;

// navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//     // Collection for recorded data.
//     let data = [];

//     // Recorder instance using the stream.
//     // Also set the stream as the src for the audio element.
//     const recorder = new MediaRecorder(stream);
//     audio.srcObject = stream;

//     recorder.addEventListener('start', e => {
//       // Empty the collection when starting recording.
//       data.length = 0;
//     });

//     recorder.addEventListener('dataavailable', event => {
//       // Push recorded data to collection.
//       data.push(event.data);
//     });

//     // Create a Blob when recording has stopped.
//     recorder.addEventListener('stop', () => {
//       const blob = new Blob(data, {
//         'type': 'audio/mp3'
//       });
//       setAudioBlob(blob);
//     });

//   });
