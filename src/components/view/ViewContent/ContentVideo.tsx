import React from 'react';

type TProps = {
  video: string;
};

export const ContentVideo: React.FC<TProps> = ({ video }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '50px',
        marginBottom: '50px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingBottom: '56.25%',
        }}
      >
        <iframe
          allowFullScreen
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          frameBorder='0'
          src={video}
          title='video'
        />
      </div>
    </div>
  );
};
