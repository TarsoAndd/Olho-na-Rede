# Configurando o contador global com Upstash Redis

## 1. Criar o banco no Upstash

1. Acesse [console.upstash.com](https://console.upstash.com)
2. Crie uma conta gratuita (login com GitHub funciona)
3. Clique em **Create Database**
4. Escolha um nome (ex: `cyberquest`)
5. Selecione a região mais próxima (ex: `South America (São Paulo)`)
6. Plano **Free** — até 10.000 comandos/dia, gratuito

## 2. Copiar as credenciais

No painel do banco criado, vá em **REST API** e copie:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## 3. Configurar no Vercel

No painel do seu projeto no Vercel:
1. Vá em **Settings → Environment Variables**
2. Adicione as duas variáveis:
   - `UPSTASH_REDIS_REST_URL` → valor copiado
   - `UPSTASH_REDIS_REST_TOKEN` → valor copiado
3. Marque para os ambientes: **Production**, **Preview** e **Development**
4. Clique em **Save** e faça um novo deploy

## 4. Testar localmente (opcional)

Preencha o `.env.local` com as credenciais e rode:

```bash
npm run dev
```

> Em desenvolvimento, o hook `useAttempts` usa dados mock para não depender
> da API. Para testar com Redis real localmente, comente as linhas de mock
> em `src/hooks/useAttempts.ts` (onde está `if (IS_DEV)`).

## Como funciona

| Evento                    | O que acontece no Redis              |
|---------------------------|--------------------------------------|
| Usuário abre um jogo      | `INCR attempts:<game-id>`            |
| Usuário conclui um jogo   | `INCR completions:<game-id>`         |
| Página de missões carrega | `MGET` de todas as chaves de uma vez |

Os contadores ficam visíveis para **todos os usuários** em tempo real,
nos cards de cada missão e dentro do jogo aberto.
