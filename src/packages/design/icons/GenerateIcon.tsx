import { type FC } from "react";
import { IconProps } from "./type";
import { defaultColor, defaultHeight, defaultWidth } from "./contants";
import styled, { css } from "styled-components";

type SvgProps = {
  $animate: boolean;
};
const Svg = styled.svg<SvgProps>`
  ${({ $animate }) =>
    $animate &&
    css`
      #arrows {
        transform-origin: 50% 50%;
        transform: rotate(0deg);
        animation: arrows 3s infinite;
        animation-timing-function: linear;
      }
    `}

  @keyframes arrows {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
export const GenerateIcon: FC<IconProps & { animate?: boolean }> = ({
  color = defaultColor,
  width = defaultWidth,
  height = defaultHeight,
  animate = false,
}) => (
  <Svg
    $animate={animate}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="arrows">
      <path
        id="Vector"
        d="M10 16H5V21M14 8H19V3M4.58301 9.0034C5.14369 7.61566 6.08244 6.41304 7.29255 5.53223C8.50266 4.65141 9.93686 4.12752 11.4298 4.02051C12.9227 3.9135 14.4147 4.2274 15.7381 4.92661C17.0615 5.62582 18.1612 6.68254 18.9141 7.97612M19.4176 14.9971C18.8569 16.3848 17.9181 17.5874 16.708 18.4682C15.4979 19.3491 14.0652 19.8723 12.5723 19.9793C11.0794 20.0863 9.58606 19.7725 8.2627 19.0732C6.93933 18.374 5.83882 17.3175 5.08594 16.0239"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </Svg>
);
