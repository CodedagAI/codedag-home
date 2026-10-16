/**
 * 着色器包里只用到 MeshGradient。shader-backdrop 动态导入的是这个文件，而不是整个包：
 * 对整个包做动态导入时，打包器无法摇掉没用到的着色器，全部 28 个都会进同一个 chunk
 */
export { MeshGradient } from '@paper-design/shaders-react';
