var myKey = 3;

var jsx = {
  nodeName: "ul",
  attributes: {},
  children: [
    {
      nodeName: "li",
      attributes: { key: "1", class: "test" },
      children: ["Item 1"],
      key: "1"
    },
    {
      nodeName: "li",
      attributes: { key: "2" },
      children: ["Item 2"],
      key: "2"
    },
    {
      nodeName: "li",
      attributes: { key: myKey },
      children: ["Item 3"],
      key: myKey
    }
  ]
};
