# 记忆系统：技术参考

本文档提供记忆系统组件的实现细节。

## 向量存储实现

### 基础向量存储

```python
import numpy as np
from typing import List, Dict, Any
import json

class VectorStore:
    def __init__(self, dimension=768):
        self.dimension = dimension
        self.vectors = []
        self.metadata = []
        self.texts = []

    def add(self, text: str, metadata: Dict[str, Any] = None):
        """将文档添加到存储。"""
        embedding = self._embed(text)
        self.vectors.append(embedding)
        self.metadata.append(metadata or {})
        self.texts.append(text)
        return len(self.vectors) - 1
    
    def search(self, query: str, limit: int = 5, 
               filters: Dict[str, Any] = None) -> List[Dict]:
        """搜索相似文档。"""
        query_embedding = self._embed(query)
        
        scores = []
        for i, vec in enumerate(self.vectors):
            score = cosine_similarity(query_embedding, vec)
            
            # 应用过滤器
            if filters and not self._matches_filters(self.metadata[i], filters):
                score = -1  # 排除
            
            scores.append((i, score))
        
        # 按分数排序
        scores.sort(key=lambda x: x[1], reverse=True)
        
        # 返回前 k 个
        results = []
        for idx, score in scores[:limit]:
            if score > 0:  # 只包含正匹配
                results.append({
                    "index": idx,
                    "score": score,
                    "text": self._get_text(idx),
                    "metadata": self.metadata[idx]
                })
        
        return results
    
    def _embed(self, text: str) -> np.ndarray:
        """为文本生成嵌入。"""
        # 在生产环境中，使用实际的嵌入模型
        return np.random.randn(self.dimension)
    
    def _matches_filters(self, metadata: Dict, filters: Dict) -> bool:
        """检查元数据是否匹配过滤器。"""
        for key, value in filters.items():
            if key not in metadata:
                return False
            if isinstance(value, list):
                if metadata[key] not in value:
                    return False
            elif metadata[key] != value:
                return False
        return True
    
    def _get_text(self, index: int) -> str:
        """检索索引的原始文本。"""
        return self.texts[index] if index < len(self.texts) else ""
```

### 元数据增强向量存储

```python
class MetadataVectorStore(VectorStore):
    def __init__(self, dimension=768):
        super().__init__(dimension)
        self.entity_index = {}  # 实体 -> [索引]
        self.time_index = {}    # 时间范围 -> [索引]
    
    def add(self, text: str, metadata: Dict[str, Any] = None):
        """添加增强索引。"""
        index = super().add(text, metadata)
        
        # 按实体索引
        if "entity" in metadata:
            entity = metadata["entity"]
            if entity not in self.entity_index:
                self.entity_index[entity] = []
            self.entity_index[entity].append(index)
        
        # 按时间索引
        if "valid_from" in metadata:
            time_key = self._time_range_key(
                metadata.get("valid_from"),
                metadata.get("valid_until")
            )
            if time_key not in self.time_index:
                self.time_index[time_key] = []
            self.time_index[time_key].append(index)
        
        return index
    
    def search_by_entity(self, query: str, entity: str, limit: int = 5) -> List[Dict]:
        """在特定实体内搜索。"""
        indices = self.entity_index.get(entity, [])
        filtered = [self.metadata[i] for i in indices]
        
        # 评分和排序
        query_embedding = self._embed(query)
        scored = []
        for i, meta in zip(indices, filtered):
            vec = self.vectors[i]
            score = cosine_similarity(query_embedding, vec)
            scored.append((i, score, meta))
        
        scored.sort(key=lambda x: x[1], reverse=True)
        
        return [{
            "index": idx,
            "score": score,
            "metadata": meta
        } for idx, score, meta in scored[:limit]]
```

## 知识图谱实现

### 属性图存储

```python
from typing import Dict, List, Optional
import uuid

class PropertyGraph:
    def __init__(self):
        self.nodes = {}  # id -> 属性
        self.edges = []  # 边字典列表
        self.indexes = {
            "node_label": {},  # 标签 -> [节点id]
            "edge_type": {}    # 类型 -> [边id]
        }
    
    def create_node(self, label: str, properties: Dict = None) -> str:
        """创建带标签和属性的节点。"""
        node_id = str(uuid.uuid4())
        self.nodes[node_id] = {
            "label": label,
            "properties": properties or {}
        }
        
        # 按标签索引
        if label not in self.indexes["node_label"]:
            self.indexes["node_label"][label] = []
        self.indexes["node_label"][label].append(node_id)
        
        return node_id
    
    def create_relationship(self, source_id: str, rel_type: str, 
                           target_id: str, properties: Dict = None) -> str:
        """在节点之间创建有向关系。"""
        edge_id = str(uuid.uuid4())
        self.edges.append({
            "id": edge_id,
            "source": source_id,
            "target": target_id,
            "type": rel_type,
            "properties": properties or {}
        })
        
        # 按类型索引
        if rel_type not in self.indexes["edge_type"]:
            self.indexes["edge_type"][rel_type] = []
        self.indexes["edge_type"][rel_type].append(edge_id)
        
        return edge_id
    
    def query(self, cypher_like: str, params: Dict = None) -> List[Dict]:
        """
        简单查询匹配。
        
        支持的模式如：
        MATCH (e)-[r]->(o) WHERE e.id = $id RETURN r
        """
        # 在生产环境中，使用实际的图数据库
        # 这是一个简化的模式匹配器
        results = []
        
        if cypher_like.startswith("MATCH"):
            # 解析基本模式
            pattern = self._parse_pattern(cypher_like)
            results = self._match_pattern(pattern, params or {})
        
        return results
    
    def _parse_pattern(self, query: str) -> Dict:
        """解析简化的 MATCH 模式。"""
        # 用于演示的简化解析器
        return {
            "source_label": self._extract_label(query, "source"),
            "rel_type": self._extract_type(query),
            "target_label": self._extract_label(query, "target"),
            "where": self._extract_where(query)
        }
    
    def _match_pattern(self, pattern: Dict, params: Dict) -> List[Dict]:
        """针对图匹配模式。"""
        results = []
        
        for edge in self.edges:
            # 匹配关系类型
            if pattern["rel_type"] and edge["type"] != pattern["rel_type"]:
                continue
            
            source = self.nodes.get(edge["source"], {})
            target = self.nodes.get(edge["target"], {})
            
            # 匹配标签
            if pattern["source_label"] and source.get("label") != pattern["source_label"]:
                continue
            if pattern["target_label"] and target.get("label") != pattern["target_label"]:
                continue
            
            # 匹配 where 子句
            if pattern["where"] and not self._match_where(edge, source, target, params):
                continue
            
            results.append({
                "source": source,
                "relationship": edge,
                "target": target
            })
        
        return results
```

## 时序知识图谱

```python
from datetime import datetime
from typing import Optional

class TemporalKnowledgeGraph(PropertyGraph):
    def __init__(self):
        super().__init__()
        self.temporal_index = {}  # 时间范围 -> [边id]
    
    def create_temporal_relationship(
        self, 
        source_id: str, 
        rel_type: str, 
        target_id: str,
        valid_from: datetime,
        valid_until: Optional[datetime] = None,
        properties: Dict = None
    ) -> str:
        """创建带时间有效性的关系。"""
        edge_id = super().create_relationship(
            source_id, rel_type, target_id, properties
        )
        
        # 按时间索引
        time_key = self._time_range_key(valid_from, valid_until)
        if time_key not in self.temporal_index:
            self.temporal_index[time_key] = []
        self.temporal_index[time_key].append(edge_id)
        
        # 在边上存储有效性
        edge = self._get_edge(edge_id)
        edge["valid_from"] = valid_from.isoformat()
        edge["valid_until"] = valid_until.isoformat() if valid_until else None
        
        return edge_id
    
    def query_at_time(self, query: str, query_time: datetime) -> List[Dict]:
        """查询特定时间的图状态。"""
        # 查找在查询时间有效的边
        valid_edges = []
        for edge in self.edges:
            valid_from = datetime.fromisoformat(edge.get("valid_from", "1970-01-01"))
            valid_until = edge.get("valid_until")
            
            if valid_from <= query_time:
                if valid_until is None or datetime.fromisoformat(valid_until) > query_time:
                    valid_edges.append(edge)
        
        # 针对模式匹配
        pattern = self._parse_pattern(query)
        results = []
        
        for edge in valid_edges:
            if pattern["rel_type"] and edge["type"] != pattern["rel_type"]:
                continue
            
            source = self.nodes.get(edge["source"], {})
            target = self.nodes.get(edge["target"], {})
            
            results.append({
                "source": source,
                "relationship": edge,
                "target": target
            })
        
        return results
    
    def _time_range_key(self, start: datetime, end: Optional[datetime]) -> str:
        """创建用于索引的时间范围键。"""
        start_str = start.isoformat()
        end_str = end.isoformat() if end else "infinity"
        return f"{start_str}::{end_str}"
```

## 记忆整合

```python
class MemoryConsolidator:
    def __init__(self, graph: PropertyGraph, vector_store: VectorStore):
        self.graph = graph
        self.vector_store = vector_store
        self.consolidation_threshold = 1000  # 整合前的记忆数量
    
    def should_consolidate(self) -> bool:
        """检查是否应该触发整合。"""
        total_memories = len(self.graph.nodes) + len(self.graph.edges)
        return total_memories > self.consolidation_threshold
    
    def consolidate(self):
        """运行整合过程。"""
        # 步骤 1：识别重复或合并的事实
        duplicates = self.find_duplicates()
        
        # 步骤 2：合并相关事实
        for group in duplicates:
            self.merge_fact_group(group)
        
        # 步骤 3：更新有效期
        self.update_validity_periods()
        
        # 步骤 4：重建索引
        self.rebuild_indexes()
    
    def find_duplicates(self) -> List[List]:
        """查找潜在重复事实的组。"""
        # 按主题和谓词分组
        groups = {}
        
        for edge in self.graph.edges:
            key = (edge["source"], edge["type"])
            if key not in groups:
                groups[key] = []
            groups[key].append(edge)
        
        # 返回有多条边的组
        return [edges for edges in groups.values() if len(edges) > 1]
    
    def merge_fact_group(self, edges: List[Dict]):
        """合并重复边组。"""
        if len(edges) == 1:
            return
        
        # 保留最近/最相关的
        keeper = max(edges, key=lambda e: e.get("properties", {}).get("confidence", 0))
        
        # 合并元数据
        for edge in edges:
            if edge["id"] != keeper["id"]:
                self.merge_properties(keeper, edge)
                self.graph.edges.remove(edge)
    
    def merge_properties(self, target: Dict, source: Dict):
        """将源属性合并到目标中。"""
        for key, value in source.get("properties", {}).items():
            if key not in target["properties"]:
                target["properties"][key] = value
            elif isinstance(value, list):
                target["properties"][key].extend(value)
```

## 记忆-上下文集成

```python
class MemoryContextIntegrator:
    def __init__(self, memory_system, context_limit=100000):
        self.memory_system = memory_system
        self.context_limit = context_limit
    
    def build_context(self, task: str, current_context: str = "") -> str:
        """构建包含相关记忆的上下文。"""
        # 从任务中提取实体
        entities = self._extract_entities(task)
        
        # 检索每个实体的记忆
        memories = []
        for entity in entities:
            entity_memories = self.memory_system.retrieve_entity(entity)
            memories.extend(entity_memories)
        
        # 格式化记忆以用于上下文
        memory_section = self._format_memories(memories)
        
        # 与当前上下文组合
        combined = current_context + "\n\n" + memory_section
        
        # 检查限制并在需要时截断
        if self._token_count(combined) > self.context_limit:
            combined = self._truncate_context(combined, self.context_limit)
        
        return combined
    
    def _extract_entities(self, task: str) -> List[str]:
        """从任务中提取实体提及。"""
        # 在生产环境中，使用 NER 或实体提取
        import re
        pattern = r"\[([^\]]+)\]"  # [[entity_name]] 约定
        return re.findall(pattern, task)
    
    def _format_memories(self, memories: List[Dict]) -> str:
        """格式化记忆以注入上下文。"""
        sections = ["## 相关记忆"]
        
        for memory in memories:
            formatted = f"- {memory.get('content', '')}"
            if "source" in memory:
                formatted += f" (来源: {memory['source']})"
            if "timestamp" in memory:
                formatted += f" [时间: {memory['timestamp']}]"
            sections.append(formatted)
        
        return "\n".join(sections)
    
    def _token_count(self, text: str) -> int:
        """估计 token 数量。"""
        return len(text) // 4  # 粗略估算
    
    def _truncate_context(self, context: str, limit: int) -> str:
        """截断上下文以适应限制。"""
        tokens = context.split()
        truncated = []
        count = 0
        
        for token in tokens:
            if count + 1 > limit:
                break
            truncated.append(token)
            count += 1
        
        return " ".join(truncated)
```
