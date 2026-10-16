"use client";

/**
 * 两站共享（公开站与 App 站各存一份，内容逐字节相同）：
 * 头像菜单"悬停即展开、点击也能展开"的开合逻辑。
 *
 * 只有鼠标的悬停会展开/收起（触屏没有悬停，键盘靠不了悬停），触屏与键盘仍走
 * Radix DropdownMenu 自带的点击、Enter/Space、方向键；展开和收起各有一点延迟，
 * 鼠标从头像移到菜单内容的路上不会闪一下。配合 `modal={false}` 使用：模态菜单会
 * 禁掉菜单外的指针事件，鼠标移开时触发不了收起。
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 200;

type PointerHandlers = {
  onPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: PointerEvent<HTMLElement>) => void;
};

/** Radix DismissableLayer 的 onPointerDownOutside 事件，只用到这两样，不引 Radix 的类型 */
type OutsideEvent = { target: EventTarget | null; preventDefault: () => void };

export function useHoverMenu(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 挂在触发器（头像按钮）上 */
  triggerProps: PointerHandlers & {
    ref: RefObject<HTMLButtonElement | null>;
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  };
  /** 挂在菜单内容上：鼠标进入内容时取消收起；按在触发器上不算"点击外部" */
  contentProps: PointerHandlers & {
    onPointerDownOutside: (event: OutsideEvent) => void;
  };
} {
  const [open, setOpenState] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  // 当前这次展开是不是悬停打开的：是的话，紧接着点头像不收起（Radix 的点击默认是切换）
  const openedByHover = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const setOpen = useCallback(
    (next: boolean) => {
      clearTimer();
      openedByHover.current = false;
      setOpenState(next);
    },
    [clearTimer],
  );

  const scheduleOpen = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => {
      openedByHover.current = true;
      setOpenState(true);
    }, OPEN_DELAY_MS);
  }, [clearTimer]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      // 悬停已打开时按下鼠标：阻止默认（Radix 据此跳过它的切换），菜单保持打开；
      // 之后再点一次按常规切换关闭
      if (open && openedByHover.current && event.pointerType === "mouse") {
        event.preventDefault();
        openedByHover.current = false;
      }
    },
    [open],
  );

  // 非模态菜单把触发器也算"外部"，按在头像上会先被它关掉、再由触发器切换一次；
  // 这里把落在触发器上的按下排除，开合只由触发器决定
  const onPointerDownOutside = useCallback((event: OutsideEvent) => {
    const target = event.target;
    if (target instanceof Node && triggerRef.current?.contains(target)) {
      event.preventDefault();
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpenState(false), CLOSE_DELAY_MS);
  }, [clearTimer]);

  const onPointerEnter = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") scheduleOpen();
    },
    [scheduleOpen],
  );
  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") scheduleClose();
    },
    [scheduleClose],
  );
  const onContentEnter = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") clearTimer();
    },
    [clearTimer],
  );

  return {
    open,
    setOpen,
    triggerProps: { ref: triggerRef, onPointerEnter, onPointerLeave, onPointerDown },
    contentProps: {
      onPointerEnter: onContentEnter,
      onPointerLeave,
      onPointerDownOutside,
    },
  };
}
