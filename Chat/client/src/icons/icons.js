import { Icon, createIcon } from "@chakra-ui/react";

export const LogoutIcon = createIcon({
  displayName: "LogoutIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <path
        d="M7 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2V4z"
        fill="currentColor"
      />
      <path d="M20 12l-5-5v3H9v4h6v3l5-5z" fill="currentColor" />
    </>
  ),
});

export const SettingsIcon = createIcon({
  displayName: "SettingsIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M12 9c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm0 2c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 6c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"
    />
  ),
});

export const ProfileIcon = createIcon({
  displayName: "ProfileIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        fill="currentColor"
        d="M2 20c0-2.5 2-4.5 4.5-4.5h11c2.5 0 4.5 2 4.5 4.5v1H2v-1z"
      />
    </>
  ),
});

export const BlockIcon = createIcon({
  displayName: "BlockIcon",
  viewBox: "0 0 24 24",
  path: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" />
    </>
  ),
});

export const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.002 21L23 12L2.002 2.99999L2 10L17 12L2 14V21Z"
      fill="currentColor"
    />
  </svg>
);

export const AttachFilesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.222,5.778C16.804,4.36,14.904,4.36,13.486,5.778l-6.364,6.364c-1.172,1.172-1.172,3.071,0,4.243 c1.171,1.171,3.071,1.171,4.242,0l4.122-4.121c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0l-4.96,4.961 c-0.195,0.195-0.195,0.512,0,0.707s0.512,0.195,0.707,0l4.546-4.545c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414 l-4.122,4.121c-0.586,0.586-1.536,0.586-2.121,0c-0.586-0.586-0.586-1.536,0-2.121l6.364-6.364c1.171-1.171,3.071-1.171,4.242,0 c1.172,1.171,1.172,3.071,0,4.242l-6.364,6.364c-1.562,1.562-4.095,1.562-5.657,0c-1.562-1.562-1.562-4.095,0-5.657 l6.364-6.364c1.953-1.953,5.128-1.953,7.081,0C20.175,0.65,20.175,3.825,18.222,5.778z" />
  </svg>
);
