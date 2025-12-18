type CrudOptions = {
  baseEndpoint: string;
  token: string;
};

export function createCrudService<T>({ baseEndpoint, token }: CrudOptions) {
  return {
    async create(data: T) {
      const res = await fetch(baseEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    async update(id: string, data: T) {
      const res = await fetch(`${baseEndpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    async remove(id: string) {
      await fetch(`${baseEndpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  };
}
