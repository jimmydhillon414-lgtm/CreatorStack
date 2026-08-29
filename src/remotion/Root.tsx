import { Composition } from 'remotion';
import { MainVideo, type MainVideoProps } from './MainVideo';

const defaultVideoProps: MainVideoProps = {
  title: 'Top 3 High-Growth Stocks 2026',
  scenes: [
    {
      sceneNumber: 1,
      caption: 'Market Trends shifting fast!',
      voiceover: 'Market trends are shifting fast in 2026.',
      graphicType: 'stock_chart',
      graphicData: { label: 'S&P 500', value: '+12.4%', trend: 'up' },
    },
  ],
  audioUrl: '',
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CreatorStackVideo"
      component={MainVideo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultVideoProps}
    />
  );
};
