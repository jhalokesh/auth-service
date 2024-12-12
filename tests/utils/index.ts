import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJwt = (token: string | null): boolean => {
    if (token === null) return false;

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
        return false;
    }

    try {
        tokenParts.forEach((tokenPart) => {
            Buffer.from(tokenPart, 'base64url').toString('utf-8');
        });
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return false;
    }
};
