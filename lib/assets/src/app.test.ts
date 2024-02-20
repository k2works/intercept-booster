import { sum } from "./app";

test("adds 1 + 2 to equal 3", () => {
  const result = sum(1, 2);
  expect(result).toBe(3);
});

describe("Lodashの基本的な使い方", () => {
  const _ = require("lodash");

  describe("リスト要素の追加・取得など", () => {
    const dataList = ["A", "B", "C", "D", "E"];

    test("_.range", () => {
      expect(_.range(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("_.concat (append)", () => {
      expect(_.concat(dataList, "Z")).toEqual(["A", "B", "C", "D", "E", "Z"]);
    });

    test("_.concat (prepend)", () => {
      expect(_.concat(["Z"], dataList)).toEqual(["Z", "A", "B", "C", "D", "E"]);
    });

    test("_.head (first)", () => {
      expect(_.head(dataList)).toBe("A");
    });

    test("_.last", () => {
      expect(_.last(dataList)).toBe("E");
    });

    test("_.tail (rest)", () => {
      expect(_.tail(dataList)).toEqual(["B", "C", "D", "E"]);
    });

    test("_.take", () => {
      expect(_.take(dataList, 2)).toEqual(["A", "B"]);
    });

    test("_.drop", () => {
      expect(_.drop(dataList, 2)).toEqual(["C", "D", "E"]);
    });

    test("_.takeRight (take-last)", () => {
      expect(_.takeRight(dataList, 2)).toEqual(["D", "E"]);
    });

    test("_.dropRight (drop-last)", () => {
      expect(_.dropRight(dataList, 2)).toEqual(["A", "B", "C"]);
    });

    test("_.takeWhile (take-while)", () => {
      expect(_.takeWhile(dataList, (data: string) => data !== "C")).toEqual([
        "A",
        "B",
      ]);
    });

    test("_.dropWhile (drop-while)", () => {
      expect(_.dropWhile(dataList, (data: string) => data !== "C")).toEqual([
        "C",
        "D",
        "E",
      ]);
    });
  });

  describe("filter/map/reduce", () => {
    const dataList = ["A", "B", "C", "D", "E"];
    const f = (data: string) => data === "C" || data === "D";
    const mf = (data: string) => (data === "C" ? null : "X" + data);
    const mf2 = (data: string, i: string) => data + i;
    const mf3 = (data: string) => [data, data];
    const nested = [1, [[2]], [[[3]]]];
    const rf = (acc: string, val: string) => acc + val;

    test("_.find", () => {
      expect(_.find(dataList, f)).toBe("C");
    });

    test("_.some", () => {
      expect(_.some(dataList, f)).toBe(true);
    });

    test("_.filter", () => {
      expect(_.filter(dataList, f)).toEqual(["C", "D"]);
    });

    test("_.reject (filterNot/remove)", () => {
      expect(_.reject(dataList, f)).toEqual(["A", "B", "E"]);
    });

    test("_.map", () => {
      expect(_.map(dataList, mf)).toEqual(["XA", "XB", null, "XD", "XE"]);
    });

    test("_.map and _.without (mapNotNull/keep)", () => {
      expect(_(dataList).map(mf).without(null).value()).toEqual([
        "XA",
        "XB",
        "XD",
        "XE",
      ]);
    });

    test("_.map (map-indexed)", () => {
      expect(_.map(dataList, mf2)).toEqual(["A0", "B1", "C2", "D3", "E4"]);
    });

    test("_.flatMap (flatMap/mapcat)", () => {
      expect(_.flatMap(dataList, mf3)).toEqual([
        "A",
        "A",
        "B",
        "B",
        "C",
        "C",
        "D",
        "D",
        "E",
        "E",
      ]);
    });

    test("_.flatten (flatten（一段階）)", () => {
      expect(_.flatten(nested)).toEqual([1, [2], [[3]]]);
    });

    test("_.flattenDeep (flatten)", () => {
      expect(_.flattenDeep(nested)).toEqual([1, 2, 3]);
    });

    test("_.reduce (reduce（初期値なし）)", () => {
      expect(_.reduce(dataList, rf)).toBe("ABCDE");
    });

    test("_.reduce (reduce（初期値あり）)", () => {
      expect(_.reduce(dataList, rf, "X")).toBe("XABCDE");
    });

    test("_.zip (zip/interleave)", () => {
      expect(_.zip(["XX", "YY"], dataList, [99, 88])).toEqual([
        ["XX", "A", 99],
        ["YY", "B", 88],
        [undefined, "C", undefined],
        [undefined, "D", undefined],
        [undefined, "E", undefined],
      ]);
    });
  });

  describe("高度なリスト操作", () => {
    type users = { user: string; age: number };
    const dataList = ["A", "B", "C", "D", "E"];
    const users = [
      { user: "fred", age: 48 },
      { user: "barney", age: 36 },
      { user: "fred", age: 40 },
    ];
    const dupList = [1, 1, 2, 1];

    test("_.sortBy (sort-by)", () => {
      expect(_.sortBy(users, ["user"])).toEqual([
        { user: "barney", age: 36 },
        { user: "fred", age: 48 },
        { user: "fred", age: 40 },
      ]);
    });

    test("_.groupBy (group-by)", () => {
      expect(
        _.groupBy(users, (item: users) => Math.floor(item.age / 10)),
      ).toEqual({
        "3": [{ user: "barney", age: 36 }],
        "4": [
          { user: "fred", age: 48 },
          { user: "fred", age: 40 },
        ],
      });
    });

    test("_.countBy (frequencies)", () => {
      expect(
        _.countBy(users, (item: users) => Math.floor(item.age / 10)),
      ).toEqual({
        "3": 1,
        "4": 2,
      });
    });

    test("_.uniq (distinct)", () => {
      expect(_.uniq(dupList)).toEqual([1, 2]);
    });

    test("_.reduce and _.tail (dedupe)", () => {
      expect(
        _.reduce(
          _.tail(dupList),
          (acc: number, val: number) =>
            val !== _.last(acc) ? _.concat(acc, val) : acc,
          [_.head(dupList)],
        ),
      ).toEqual([1, 2, 1]);
    });

    test("_.shuffle (shuffle)", () => {
      const shuffled = _.shuffle(dataList);
      expect(shuffled).toHaveLength(dataList.length);
      expect(shuffled).toContain("A");
      expect(shuffled).toContain("B");
      expect(shuffled).toContain("C");
      expect(shuffled).toContain("D");
      expect(shuffled).toContain("E");
    });

    test("_.chunk (partitionAll)", () => {
      expect(_.chunk(dataList, 2)).toEqual([["A", "B"], ["C", "D"], ["E"]]);
    });
  });

  describe("オブジェクトに対する操作", () => {
    type dataMap = { x: string; y: { y1: number; y2: number }; z: string };
    let dataMap = { x: "x1", y: { y1: 1, y2: 2 }, z: "Z" };

    test("_.get (get-in)", () => {
      expect(_.get(dataMap, "y.y2")).toBe(2);
    });

    test("_.set (assoc-in)", () => {
      expect(_.set({ ...dataMap }, "y.y3", 33)).toEqual({
        x: "x1",
        y: { y1: 1, y2: 2, y3: 33 },
        z: "Z",
      });
    });

    test("_.omit (dissoc-in)", () => {
      expect(_.omit({ ...dataMap }, "y.y2")).toEqual({
        x: "x1",
        y: { y1: 1, y3: 33 },
        z: "Z",
      });
    });

    test("_.update (update-in)", () => {
      expect(
        _.update({ ...dataMap }, "y.y2", (data: number) => data * data),
      ).toEqual({
        x: "x1",
        y: { y1: 1, y2: 4, y3: 33 },
        z: "Z",
      });
    });

    test("_.pick (select-keys)", () => {
      expect(_.pick(dataMap, ["x", "z"])).toEqual({ x: "x1", z: "Z" });
    });

    test("Object.entries (entries)", () => {
      expect(Object.entries(dataMap)).toEqual([
        ["x", "x1"],
        ["y", { y1: 1, y2: 4, y3: 33 }],
        ["z", "Z"],
      ]);
    });

    test("_.mapValues (mapValues)", () => {
      expect(
        _.mapValues(dataMap, (value: string | number, key: string) =>
          typeof value === "string" ? `${key}#${value}` : 99,
        ),
      ).toEqual({ x: "x#x1", y: 99, z: "z#Z" });
    });

    test("_.assign (merge)", () => {
      expect(_.assign({ ...dataMap }, { y: "Y", zz: "ZZ" })).toEqual({
        x: "x1",
        y: "Y",
        z: "Z",
        zz: "ZZ",
      });
    });

    test("_.merge (mergeDeep)", () => {
      expect(_.merge({ ...dataMap }, { y: { y1: "YYY" } })).toEqual({
        x: "x1",
        y: { y1: "YYY", y2: 4, y3: 33 },
        z: "Z",
      });
    });

    test("_.mergeWith (merge-with)", () => {
      expect(
        _.mergeWith(
          { ...dataMap },
          { x: "X" },
          (v1: number, v2: number) => v1 + v2,
        ),
      ).toEqual({ x: "x1X", y: { y1: "YYY", y2: 4, y3: 33 }, z: "Z" });
    });

    test("_.zipObject (zipmap)", () => {
      expect(_.zipObject(["a", "b"], [1, 2])).toEqual({ a: 1, b: 2 });
    });
  });
});
