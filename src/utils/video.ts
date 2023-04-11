import querystring from 'query-string';
import axios from 'axios';

const videoConfigs = {
  youtube: {
    accessToken: 'AIzaSyCSeQqegXptc8xT30GwaTM0SbZkd-CweZk',
  },
};

const getVkData = async video => {
  let vkData = null;
  if (video.match(/^-?[0-9]+_[0-9]+$/)) {
    vkData = await axios.get(`/api/1.0/proxy/vk?videoId=${video}`);
  } else {
    const match = video.match(/oid=([0-9-]+)&id=([0-9-]+)/);
    if (match) {
      vkData = await axios.get(
        `/api/1.0/proxy/vk?videoId=${match[1]}_${match[2]}`
      );
    }
  }
  return vkData ? vkData.data.response : null;
};

export const videoSrcBuildersHash = {
  youtube: async videoId =>
    `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`,
  vimeo: async videoId =>
    `https://player.vimeo.com/video/${videoId}?title=0&byline=0&autoplay=false`,
  ok: async videoId =>
    `https://ok.ru/videoembed/${videoId}?nochat=1&autoplay=0`,
  vk: async videoId => {
    const data = await getVkData(videoId);
    return data && data.items.length > 0 ? data.items[0].player : null;
  },
};

export const videoPreviewBuildersHash = {
  youtube: async videoId => {
    const qs = querystring.stringify({
      id: videoId,
      part: 'snippet',
      key: videoConfigs.youtube.accessToken,
      fields: 'items(snippet/thumbnails)',
    });

    const { data } = await axios.get(
      `https://content.googleapis.com/youtube/v3/videos?${qs}`
    );
    const item = data.items[0];
    let thumbnailsUrl = null;

    if (item) {
      const thumbnails = item.snippet.thumbnails;

      if (thumbnails.maxres) {
        thumbnailsUrl = thumbnails.maxres.url;
      } else {
        thumbnailsUrl = thumbnails.high.url;
      }
    }
    return thumbnailsUrl;
  },
  vimeo: videoId =>
    axios
      .get(`https://vimeo.com/api/v2/video/${videoId}.json`)
      .then(({ data }) => {
        const item = data[0];
        return item && item.thumbnail_large;
      }),
  vk: async videoId => {
    const data = await getVkData(videoId);
    return data && data.items.length > 0
      ? data.items[0].image.slice(-1)[0].url
      : null;
  },
  ok: false,
};

export const parseVideoSource = source => {
  if (!source) return;

  const services = [
    {
      name: 'vk',
      domain: 'vk.com',
      videoIdPattern: /oid=-?\d{1,16}&id=\d{1,16}&hash=[\da-f]{16}/,
    },
    {
      name: 'youtube',
      domain: 'youtube.com',
      videoIdPattern: /v=([\w-]{11})/,
    },
    {
      name: 'youtube',
      domain: 'youtu.be',
      videoIdPattern: /\/([\w-]{11})/,
    },
    {
      name: 'ok',
      domain: 'ok.ru',
      videoIdPattern: /[\d]{1,16}/,
    },
    {
      name: 'rutube',
      domain: 'rutube.ru',
      videoIdPattern: /[\da-f]{32}/,
    },
  ];

  const service = services.find(({ domain }) => source.includes(domain));
  const match = source.match(service.videoIdPattern);
  const id = service && match?.[match.length - 1];

  return id && { provider: service.name, id };
};

export const parseVideoUrl = url => {
  // https://github.com/regexhq
  // TODO! Объединить работу с провайдерами в единый сервис
  const provides = {
    youtube: url => {
      // eslint-disable-next-line max-len
      const match = url.match(
        /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/
      );
      return match ? match.pop() : null;
    },

    vimeo: url => {
      // eslint-disable-next-line max-len
      const match = url.match(
        /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/
      );
      return match ? match.pop() : null;
    },

    vk: url => {
      let videoId = null;
      // embed code
      if (url.match(/(http|https:\/\/)?vk\.com\/video_ext.php\?/)) {
        const oid = url.match(/oid=([0-9-]+)/);
        const id = url.match(/(&|\?)id=([0-9-]+)/);
        if (oid && id) {
          videoId = `${oid.pop()}_${id.pop()}`;
        }
      } else {
        const match = url.match(
          /(http|https:\/\/)?vk\.com\/\S*(video(\?|)(z=video)?|(videos))(-?[0-9]+_[0-9]+)/
        );
        if (match) {
          videoId = match.pop();
        }
      }
      return videoId;
    },

    ok: url => {
      const match = url.match(
        /(http|https:\/\/)?ok\.ru\/(video|live)\/([0-9]+)/
      );
      return match ? match.pop() : null;
    },
  };

  let result = null;
  Object.keys(provides).forEach(provider => {
    const videoId = provides[provider](url);
    if (videoId) {
      result = { provider, id: videoId };
    }
  });
  return result;
};
