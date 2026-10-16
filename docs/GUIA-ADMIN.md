# Guia rápido do painel administrativo

Endereço: **https://hospitalaresfenix.com.br/admin**

## Primeiro acesso

1. Entre com o e-mail e a senha cadastrados.
2. Na tela “Verificação em duas etapas”, clique em **Configurar autenticador**.
3. No celular, abra o aplicativo autenticador (Google Authenticator, Microsoft Authenticator, 1Password ou Authy), escaneie o QR code e digite o código de 6 dígitos.
4. Pronto. Nos próximos acessos, basta informar e-mail, senha e o código do aplicativo.

> A sessão expira 8 horas após a verificação. Depois de 5 tentativas erradas de senha ou de código, o acesso fica bloqueado por 15 minutos.

## Leads (pedidos de orçamento)

- **Leads** lista todos os pedidos, do mais recente para o mais antigo.
- Use a busca (nome, instituição, e-mail, área), o filtro de **status** e as datas.
- Clique em um lead para ver os detalhes, trocar o **status** (Novo → Em contato → Proposta → Fechado) e escrever **notas internas**. Clique em **Salvar**.
- O telefone abre direto o WhatsApp do cliente.
- **Exportar CSV** baixa os leads do filtro atual (abre no Excel/Google Planilhas).
- **Excluir definitivamente**: use quando o titular pedir a exclusão dos dados (LGPD). A ação fica registrada na auditoria.

## Conteúdo do site

Todas as telas seguem o mesmo padrão: lista → **Editar** ou **+ Novo** → **Salvar**. As mudanças aparecem no site em alguns segundos.

- **Ativo:** desmarque para ocultar um item do site sem apagá-lo.
- **Ordem:** números menores aparecem primeiro.
- **Campos “um por linha”:** cada linha vira um item da lista no site.

### Áreas (explorador)
Nome, ícone, resumo, cenários de uso, benefícios, **cartuchos recomendados** (marque os produtos) e **segmentos de clientes** que aparecem em “Quem já atendemos neste segmento”.

### Produtos
Nome, tipo, resumo, descrição, parâmetros, destaques, selo **sob consulta** e imagem (opcional).

### Clientes
- **Logo:** SVG, PNG, JPG ou WebP, até 2 MB (prefira SVG ou PNG com fundo transparente). SVGs são higienizados automaticamente.
- **Segmento:** grupo em que aparece na lista. **Também aparece nos segmentos:** use, por exemplo, para que a Vetex apareça também em “Medicina veterinária”.
- **Destaque:** entra no carrossel de logos da página inicial.
- Só publique logos com autorização da instituição.

### Depoimentos
Apenas depoimentos reais, com autorização: nome, cargo, instituição e texto. A seção só aparece no site quando houver ao menos um depoimento ativo.

## Auditoria

Mostra quem fez o quê e quando: logins (e falhas), alterações de conteúdo, mudanças em leads e exportações.

## Boas práticas

- Não compartilhe a senha nem o aplicativo autenticador. Cada pessoa deve ter seu próprio usuário.
- Se trocar de celular, peça ao responsável técnico para redefinir o 2FA do seu usuário no Supabase (*Auth → Users → … → Remove MFA factors*).
- Sempre clique em **Sair** ao terminar, principalmente em computadores compartilhados.
