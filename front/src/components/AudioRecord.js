import React, { useEffect } from 'react';
import useRecorder from '../utils/useMyRecorder'


export default function AudioRecord({ avatar, handleVoiceSearch }) {
    const [audioURL, isRecording, startRecording, stopRecording, getAudioBlob] = useRecorder();

    const handleStopRecord = () => {
        stopRecording();
    }

    useEffect(() => {
        if (audioURL) {
            handleVoiceSearch(audioURL);
        }
    }, [audioURL])
    return (
        <div className="record">
            {
                isRecording ? (
                    <button
                        className="record__btn record__btn_state-active"
                        onClick={handleStopRecord}
                        disabled={!isRecording}
                    />
                ) : (
                    <button
                        className="record__btn record__btn_state-idle"
                        onClick={startRecording}
                        disabled={isRecording}
                    />
                )
            }
        </div>
    )
}
