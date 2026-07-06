# Coach route smoke test

With the development server running:

```bash
curl -X POST http://localhost:3000/api/ai/coach \
  -H "Content-Type: application/json" \
  -d '{"task_type":"weekly_review","user_question":"What should I focus on this week?"}'
```

The route returns the local structured response when `OPENAI_API_KEY` is absent.
With a key configured, it sends only the compact summary object to the Responses API
and returns a schema-constrained response.
