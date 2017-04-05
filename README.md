# 手势密码
-----
- ## author
　北京林业大学 肖晗
- ## thinking
1. 先完成html页面的布局
2. 通过浏览器来设置画布的宽度，并设置最大和最小宽度，通过计算让9个点位置居中
3. 设置一个初始化事件init，canvas生成9个圆点，位置存储在数组points中，该事件也用于touch事件结束时重置画布
4. 在触摸滑动时，设置一个checkTouch事件检测当前触摸位置和9个点有无交叉，如果有，则放入一个用来记录触摸过的点的数组touchPoint中
5. 如果选中的两个点之间有一个点没有被选中，则自动选中该点记录在该两点之间
6. 触摸滑动时，将数组触摸过的点touchPoint用线连接，重画所有的点，被触摸的点用特殊颜色显示；并且将touchPoint最后一个点设为起点引出一条线，到现在触摸的位置。
7. 设置密码时保存一个全局变量为第一次输入的密码，再通过比较第二次密码是否相同如果相同则存储，不相同则清空第一次的密码提示重新设置
8. 验证密码用输入的密码和localstorage中的密码比较。