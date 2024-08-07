import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1140 1140"
      fill="none"
      aria-label={`${process.env.SITE_NAME} logo`}
      className={clsx('h-4 w-4 fill-black dark:fill-white', props.className)}
      {...props}
    >
      <g filter="url(#a)">
        <rect width={1132} height={1132} x={4} fill="#000" rx={82} />
      </g>
      <path
        stroke="#000"
        strokeWidth={0.1}
        d="M279.599 275.598H861.13v581.531H279.599z"
      />
      <g clipPath="url(#b)">
        <path
          fill="#FFC233"
          fillRule="evenodd"
          d="m822.15 394.404 124.831 57.671c15.472 7.151 26.392 19.153 32.291 32.921 14.917 34.863-5.471 70.519-37.476 83.343-32.012 12.817-66.128 4.568-81.64-31.687L805.83 409.367c-4.21-9.867 6.365-19.562 16.32-14.963Zm7.483-37.333 128.858-48.676c42.829-16.177 89.609 14.432 88.979 58.906-.01.581-.02 1.161-.04 1.747-.92 43.308-46.4 72.417-88.289 57.095l-129.386-47.322c-10.321-3.773-10.397-17.869-.122-21.75Zm-7.214-16.86 126.672-53.785c42.093-17.875 52.779-71.523 19.809-102.521-.432-.407-.866-.812-1.302-1.214-32.322-29.98-85.752-19.424-104.153 20.063l-56.843 121.998c-4.536 9.728 5.715 19.747 15.817 15.459Zm-32.598-21.254 46.054-126.188c5.71-15.647 4.652-31.603-1.251-45.37-14.948-34.849-55.429-46.098-87.43-33.255-31.996 12.848-50.076 42.025-34.533 78.266l54.682 127.147c4.24 9.853 18.807 9.464 22.478-.6Z"
          clipRule="evenodd"
        />
      </g>
      <path
        stroke="#FF5387"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={40}
        d="M376.487 736.006V425.803c0-27.146 0-40.719 5.283-51.087a48.464 48.464 0 0 1 21.182-21.181c10.368-5.283 23.941-5.283 51.086-5.283h232.653c27.145 0 40.719 0 51.086 5.283a48.452 48.452 0 0 1 21.181 21.181c5.283 10.368 5.283 23.941 5.283 51.087v261.734H424.957c-26.769 0-48.47 21.699-48.47 48.469Zm0 0c0 26.769 21.701 48.469 48.47 48.469h339.284M497.66 445.19h145.408M497.66 542.129h145.408m96.939 145.408v96.938"
      />
      <defs>
        <clipPath id="b">
          <path fill="#fff" d="M698 109h349v465H698z" />
        </clipPath>
        <filter
          id="a"
          width={1140}
          height={1140}
          x={0}
          y={0}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_14_48" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_14_48"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
