export class Config {
  private constructor() {}
  private static items = {};

  static resolveVariables(search: string) {
    const varRegex = /{{([a-zA-Z.]+[a-zA-Z0-9-_.]*)}}/gm;
    let resolved = search;

    let match: RegExpExecArray | null;
    do {
      match = varRegex.exec(resolved);
      if (match)
        resolved = resolved.replace(
          match[0],
          Config.get(`project.${match[1]}`)
        );
    } while (match);

    return resolved;
  }

  static get(name: string, defaultValue = undefined) {
    const nestedItems = name.split(".");
    let currentItem = Config.items;

    for (const item of nestedItems) {
      if (currentItem[item]) currentItem = currentItem[item];
      else return defaultValue;
    }

    return currentItem;
  }

  static set(item: string, value: any) {
    const nestedItems = item.split(".");
    if (nestedItems.length === 1) Config.items[item] = value;
    else {
      let confItem = Config.items;
      for (let index = 0; index < nestedItems.length; index++) {
        const currentItem = nestedItems[index];

        if (index + 1 === nestedItems.length) confItem[currentItem] = value;
        else if (!confItem[currentItem]) confItem[currentItem] = {};

        confItem = confItem[currentItem];
      }
    }
  }
}
