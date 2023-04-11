export const videoHostings = [
  {
    label: 'YouTube',
    name: 'youtube',
    url: 'https://youtu.be/%id',
  },
  {
    label: 'Vimeo',
    name: 'vimeo',
    url: 'https://vimeo.com/%id',
  },
  {
    label: 'ВКонтакте',
    name: 'vk',
    url: 'https://vk.com/video%id',
  },
  {
    label: 'Одноклассники',
    name: 'ok',
    url: 'https://ok.ru/%id',
  },
];

export function getVideoUrl(provider, id) {
  const videoHostingsHash = videoHostings.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});
  return videoHostingsHash[provider].url.replace('%id', id);
}
