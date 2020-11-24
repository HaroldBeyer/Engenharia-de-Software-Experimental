import { Instance } from "./instance";

export class Loader {
  instances: Instance[];

  constructor(instances: Instance[]) {
    this.instances = instances;
  }

  retrieveInstance(): Instance {
    return this.instances.reduce((a, b) => {
      const max = Math.max(a.usage, b.usage);
      if (a.usage == max)
        return a;
      else
        return b;
    });
  }

  run(operation: string, req, res) {
    const instance = this.retrieveInstance();
    if (operation == 'post') {
      return instance.post(req, res)
    }
    else {
      return instance.get(req, res)
    }
  }

}