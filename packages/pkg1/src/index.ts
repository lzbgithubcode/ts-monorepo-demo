import sum2 from "@zb/pkg2";

export const sum1 = (num1: number, num2: number) => {
  console.log("我是第pkg1包------", num1, num2);
  const let = "123";
  const name = "孙悟空";
  sum2();
  console.log(`我的名字-----${name}`);

  return num1 + num2;
};
